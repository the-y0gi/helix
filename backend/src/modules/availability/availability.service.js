const mongoose = require("mongoose");

const Availability = require("./availability.model");
const Hotel = require("../hotels/hotel.model");
const RoomType = require("../rooms/roomType.model");

const logger = require("../../shared/utils/logger");

//Create / Update availability for a date
exports.upsertAvailability = async (data) => {
  try {
    const { roomTypeId, date, availableRooms, priceOverride } = data;

    return await Availability.findOneAndUpdate(
      { roomTypeId, date },
      {
        $set: {
          availableRooms,
          ...(priceOverride !== undefined && { priceOverride }),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
  } catch (error) {
    logger.error("Service Error: upsertAvailability", error);
    throw error;
  }
};

//Get availability for date range (User side)
exports.getAvailabilityForRange = async (roomTypeId, startDate, endDate) => {
  if (!mongoose.Types.ObjectId.isValid(roomTypeId)) {
    throw new Error("Invalid roomType id");
  }

  try {
    return await Availability.find({
      roomTypeId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).lean();
  } catch (error) {
    logger.error("Service Error: getAvailabilityForRange", error);
    throw error;
  }
};

//Atomic decrement (Booking time)
exports.decreaseAvailability = async (roomTypeId, date, qty = 1) => {
  try {
    const result = await Availability.findOneAndUpdate(
      {
        roomTypeId,
        date,
        availableRooms: { $gte: qty },
      },
      {
        $inc: { availableRooms: -qty },
      },
      { new: true },
    );

    if (!result) {
      throw new Error("Rooms not available for selected date");
    }

    return result;
  } catch (error) {
    logger.error("Service Error: decreaseAvailability", error);
    throw error;
  }
};

//get room type
exports.getVendorRoomTypes = async (vendorId, hotelId) => {
  try {
    const hotel = await Hotel.findOne({
      _id: hotelId,
      vendorId,
      isActive: true,
    }).lean();

    if (!hotel) {
      throw new Error("Hotel not found or not authorized");
    }

    const roomTypes = await RoomType.find({
      hotelId,
      isActive: true,
    })
      .select("_id name basePrice discountPrice totalRooms")
      .sort({ createdAt: 1 })
      .lean();

    return roomTypes;
  } catch (error) {
    logger.error("Service Error: getVendorRoomTypes", error);
    throw error;
  }
};

//room type calender data return
exports.getRoomTypeCalendar = async (vendorId, roomTypeId, month, year) => {
  try {
    if (!month || !year) {
      throw new Error("Month and year are required");
    }

    const roomType = await RoomType.findById(roomTypeId).lean();

    if (!roomType || !roomType.isActive) {
      throw new Error("Room type not found");
    }

    const hotel = await Hotel.findOne({
      _id: roomType.hotelId,
      vendorId,
      isActive: true,
    }).lean();

    if (!hotel) {
      throw new Error("Not authorized");
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    //Fetch availability docs
    const availabilityDocs = await Availability.find({
      roomTypeId,
      date: { $gte: startDate, $lt: endDate },
    }).lean();

    //Build map
    const availabilityMap = {};

    for (const doc of availabilityDocs) {
      const dateStr = doc.date.toISOString().split("T")[0];
      availabilityMap[dateStr] = doc;
    }

    const daysInMonth = new Date(year, month, 0).getDate();

    const calendar = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      currentDate.setHours(0, 0, 0, 0);

      const dateStr = currentDate.toISOString().split("T")[0];

      const dayData = availabilityMap[dateStr];

      const bookedRooms = dayData?.bookedRooms || 0;
      const blockedRooms = dayData?.blockedRooms || 0;

      const availableRooms = roomType.totalRooms - bookedRooms - blockedRooms;

      const price =
        dayData?.priceOverride ??
        (roomType.discountPrice > 0
          ? roomType.discountPrice
          : roomType.basePrice);

      calendar.push({
        date: dateStr,
        availableRooms: Math.max(availableRooms, 0),
        bookedRooms,
        blockedRooms,
        price,
      });
    }

    return {
      roomTypeId,
      roomName: roomType.name,
      totalRooms: roomType.totalRooms,
      calendar,
    };
  } catch (error) {
    logger.error("Service Error: getRoomTypeCalendar", error);
    throw error;
  }
};

//price and date over-ride
exports.updateRoomTypeCalendar = async (
  vendorId,
  roomTypeId,
  date,
  blockedRooms,
  priceOverride,
) => {
  try {
    if (!date) throw new Error("Date is required");

    const targetDate = new Date(date + "T00:00:00");
    targetDate.setHours(0, 0, 0, 0);

    if (isNaN(targetDate.getTime())) {
      throw new Error("Invalid date");
    }

    const roomType = await RoomType.findById(roomTypeId);

    if (!roomType || !roomType.isActive) {
      throw new Error("Room type not found");
    }

    const hotel = await Hotel.findOne({
      _id: roomType.hotelId,
      vendorId,
      isActive: true,
    });

    if (!hotel) {
      throw new Error("Not authorized");
    }

    if (blockedRooms !== undefined) {
      if (blockedRooms < 0 || blockedRooms > roomType.totalRooms) {
        throw new Error("Invalid blocked rooms value");
      }
    }

    //Find existing availability doc
    let availability = await Availability.findOne({
      roomTypeId,
      date: targetDate,
    });

    //Create doc if not exist
    if (!availability) {
      availability = new Availability({
        roomTypeId,
        date: targetDate,
        bookedRooms: 0,
        blockedRooms: blockedRooms ?? 0,
        priceOverride: priceOverride ?? undefined,
      });
    } else {
      if (blockedRooms !== undefined) {
        availability.blockedRooms = blockedRooms;
      }

      if (priceOverride !== undefined) {
        availability.priceOverride = priceOverride;
      }
    }

    await availability.save();

    const availableRooms =
      roomType.totalRooms -
      (availability.bookedRooms || 0) -
      (availability.blockedRooms || 0);

    const price =
      availability.priceOverride ??
      (roomType.discountPrice > 0
        ? roomType.discountPrice
        : roomType.basePrice);

    return {
      date: date,
      availableRooms: Math.max(availableRooms, 0),
      bookedRooms: availability.bookedRooms || 0,
      blockedRooms: availability.blockedRooms || 0,
      price,
    };
  } catch (error) {
    logger.error("Service Error: updateRoomTypeCalendar", error);
    throw error;
  }
};

exports.resetRoomTypeCalendar = async (vendorId, roomTypeId, date) => {
  try {
    if (!date) {
      throw new Error("Date is required");
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (isNaN(targetDate.getTime())) {
      throw new Error("Invalid date");
    }

    const roomType = await RoomType.findById(roomTypeId);

    if (!roomType || !roomType.isActive) {
      throw new Error("Room type not found");
    }

    const hotel = await Hotel.findOne({
      _id: roomType.hotelId,
      vendorId,
      isActive: true,
    });

    if (!hotel) {
      throw new Error("Not authorized");
    }

    await Availability.deleteOne({
      roomTypeId,
      date: targetDate,
    });

    const price =
      roomType.discountPrice > 0 ? roomType.discountPrice : roomType.basePrice;

    return {
      date: targetDate.toISOString().split("T")[0],
      availableRooms: roomType.totalRooms,
      bookedRooms: 0,
      blockedRooms: 0,
      price,
    };
  } catch (error) {
    logger.error("Service Error: resetRoomTypeCalendar", error);
    throw error;
  }
};
