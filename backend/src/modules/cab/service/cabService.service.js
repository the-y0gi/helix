const mongoose = require("mongoose");
const CabService = require("./cabService.model");
const CabCompany = require("../company/cab.model");

exports.createCabService = async (data, vendorId) => {
  try {
    const {
      cabId,
      title,
      pickupLocation,
      dropLocation,
      carName,
      cabType,
      capacity,
      carNumber,
      basePrice,
      discountPrice = 0,
      meta = {},
      description,
      features = [],
      images = [],
    } = data;

    if (!cabId || !mongoose.Types.ObjectId.isValid(cabId)) {
      throw new Error("Valid cabId is required");
    }

    if (!title) throw new Error("Title is required");

    if (!pickupLocation || !dropLocation) {
      throw new Error("Pickup and Drop locations are required");
    }

    if (!carName) throw new Error("Car name is required");

    if (!cabType) throw new Error("Cab type is required");

    if (!capacity || capacity <= 0) {
      throw new Error("Valid capacity is required");
    }

    if (!basePrice || basePrice < 0) {
      throw new Error("Valid base price is required");
    }

    if (discountPrice > basePrice) {
      throw new Error("Discount price cannot exceed base price");
    }

    //VERIFY OWNERSHIP
    const cab = await CabCompany.findOne({
      _id: cabId,
      vendor: vendorId,
      isActive: true,
    });

    if (!cab) {
      throw new Error("Cab company not found or unauthorized");
    }

    //CREATE SERVICE
    const service = await CabService.create({
      cab: cabId,

      title: title.trim(),

      pickupLocation: pickupLocation.trim(),
      dropLocation: dropLocation.trim(),

      carName: carName.trim(),
      cabType,
      capacity,
      carNumber: carNumber?.trim() || "",

      basePrice,
      discountPrice,

      meta,
      description: description?.trim() || "",

      features,
      images,

      isActive: true,
    });

    return service;
  } catch (error) {
    throw error;
  }
};

exports.getVendorCabServices = async (query = {}, vendorId) => {
  try {
    const { cabId, search, cabType, page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const vendorCabs = await CabCompany.find({ vendor: vendorId })
      .select("_id")
      .lean();

    const cabIds = vendorCabs.map((c) => c._id);

    const filter = {
      cab: { $in: cabIds },
    };

    if (cabId) {
      filter.cab = cabId;
    }

    if (cabType) {
      filter.cabType = cabType;
    }

    //SEARCH (title + route)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { pickupLocation: { $regex: search, $options: "i" } },
        { dropLocation: { $regex: search, $options: "i" } },
      ];
    }

    const services = await CabService.find(filter)
      .populate("cab", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await CabService.countDocuments(filter);

    const formatted = services.map((s) => ({
      id: s._id,

      title: s.title,

      cabCompany: s.cab?.name || null,

      route: {
        pickup: s.pickupLocation,
        drop: s.dropLocation,
      },

      car: {
        name: s.carName,
        type: s.cabType,
        capacity: s.capacity,
      },

      pricing: {
        basePrice: s.basePrice,
        discountPrice: s.discountPrice,
      },

      isActive: s.isActive,
    }));

    return {
      count: formatted.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: formatted,
    };
  } catch (error) {
    throw error;
  }
};

exports.getVendorCabServiceById = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await CabService.findById(serviceId)
      .populate("cab", "name vendor")
      .lean();

    if (!service) {
      throw new Error("Cab service not found");
    }

    if (service.cab.vendor.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    const formatted = {
      id: service._id,

      cabCompany: {
        id: service.cab._id,
        name: service.cab.name,
      },

      title: service.title,

      route: {
        pickup: service.pickupLocation,
        drop: service.dropLocation,
      },

      car: {
        name: service.carName,
        type: service.cabType,
        capacity: service.capacity,
        number: service.carNumber,
      },

      pricing: {
        basePrice: service.basePrice,
        discountPrice: service.discountPrice,
      },

      meta: service.meta || {},

      description: service.description || "",

      features: service.features || [],

      images: service.images || [],

      isActive: service.isActive,

      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    return formatted;
  } catch (error) {
    throw error;
  }
};

exports.updateVendorCabService = async (serviceId, vendorId, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    //Find service + ownership check
    const service = await CabService.findById(serviceId).populate(
      "cab",
      "vendor",
    );

    if (!service) {
      throw new Error("Cab service not found");
    }

    if (service.cab.vendor.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    if (data.basePrice !== undefined && data.basePrice < 0) {
      throw new Error("Base price must be valid");
    }

    if (
      data.discountPrice !== undefined &&
      data.basePrice !== undefined &&
      data.discountPrice > data.basePrice
    ) {
      throw new Error("Discount cannot exceed base price");
    }

    const allowedFields = [
      "title",
      "pickupLocation",
      "dropLocation",
      "carName",
      "cabType",
      "capacity",
      "carNumber",
      "basePrice",
      "discountPrice",
      "meta",
      "description",
      "features",
      "images",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        service[field] =
          typeof data[field] === "string" ? data[field].trim() : data[field];
      }
    });

    await service.save();

    return service;
  } catch (error) {
    throw error;
  }
};

exports.deleteVendorCabService = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    //Find service + ownership check
    const service = await CabService.findById(serviceId).populate(
      "cab",
      "vendor",
    );

    if (!service) {
      throw new Error("Cab service not found");
    }

    if (service.cab.vendor.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    //Soft Delete
    service.isActive = false;
    await service.save();

    // Hard Delete
    // await CabService.findByIdAndDelete(serviceId);

    return;
  } catch (error) {
    throw error;
  }
};
