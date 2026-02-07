const Availability = require("./availability.model");
const mongoose = require("mongoose");
const logger = require("../../shared/utils/logger");

//Create / Update availability for a date
//(Vendor use – calendar management)
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
