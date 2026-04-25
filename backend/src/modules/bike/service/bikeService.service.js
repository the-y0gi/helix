const mongoose = require("mongoose");
const BikeService = require("./bikeService.model");
const BikeCompany = require("../company/bike.model");

exports.createBikeService = async (data, vendorId) => {
  try {
    const {
      bikeId,
      title,
      bikeName,
      bikeType,
      engineCC,
      fuelType = "petrol",
      pricePerDay,
      discountPrice = 0,
      maxDurationDays = 7,
      description,
      features = [],
      meta = {},
      images = [],
    } = data;

    if (!bikeId || !mongoose.Types.ObjectId.isValid(bikeId)) {
      throw new Error("Valid bikeId is required");
    }

    if (!title) throw new Error("Title is required");
    if (!bikeName) throw new Error("Bike name is required");
    if (!bikeType) throw new Error("Bike type is required");

    if (!pricePerDay || pricePerDay < 0) {
      throw new Error("Valid price per day is required");
    }

    if (discountPrice > pricePerDay) {
      throw new Error("Discount price cannot exceed price per day");
    }

    const bikeCompany = await BikeCompany.findOne({
      _id: bikeId,
      vendor: vendorId,
      isActive: true,
    });

    if (!bikeCompany) {
      throw new Error("Bike company not found or unauthorized");
    }

    const service = await BikeService.create({
      bike: bikeId,

      title: title.trim(),

      bikeName: bikeName.trim(),
      bikeType,
      engineCC,
      fuelType,

      pricePerDay,
      discountPrice,
      maxDurationDays,

      description: description?.trim() || "",
      features,
      meta,
      images,

      isActive: true,
    });

    return service;
  } catch (error) {
    throw error;
  }
};

exports.getVendorBikeServices = async (query = {}, vendorId) => {
  try {
    const { bikeId, search, bikeType, page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const companies = await BikeCompany.find({ vendor: vendorId })
      .select("_id")
      .lean();

    const bikeIds = companies.map((c) => c._id);

    const filter = {
      bike: { $in: bikeIds },
    };

    if (bikeId) {
      filter.bike = bikeId;
    }

    if (bikeType) {
      filter.bikeType = bikeType;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { bikeName: { $regex: search, $options: "i" } },
      ];
    }

    const services = await BikeService.find(filter)
      .populate("bike", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await BikeService.countDocuments(filter);

    const formatted = services.map((s) => ({
      id: s._id,

      title: s.title,

      company: s.bike?.name || null,

      bike: {
        name: s.bikeName,
        type: s.bikeType,
        engine: s.engineCC,
      },

      pricing: {
        pricePerDay: s.pricePerDay,
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

exports.getVendorBikeServiceById = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await BikeService.findById(serviceId)
      .populate("bike", "name vendor")
      .lean();

    if (!service) {
      throw new Error("Bike service not found");
    }

    if (service.bike.vendor.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    const formatted = {
      id: service._id,

      company: {
        id: service.bike._id,
        name: service.bike.name,
      },

      title: service.title,

      bike: {
        name: service.bikeName,
        type: service.bikeType,
        engine: service.engineCC,
        fuel: service.fuelType,
      },

      pricing: {
        pricePerDay: service.pricePerDay,
        discountPrice: service.discountPrice,
      },

      maxDurationDays: service.maxDurationDays,

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

exports.updateVendorBikeService = async (serviceId, vendorId, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await BikeService.findById(serviceId).populate(
      "bike",
      "vendor",
    );

    if (!service) {
      throw new Error("Bike service not found");
    }

    if (service.bike.vendor.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    if (data.pricePerDay !== undefined && data.pricePerDay < 0) {
      throw new Error("Invalid price per day");
    }

    if (
      data.discountPrice !== undefined &&
      data.pricePerDay !== undefined &&
      data.discountPrice > data.pricePerDay
    ) {
      throw new Error("Discount cannot exceed price");
    }

    const allowedFields = [
      "title",
      "bikeName",
      "bikeType",
      "engineCC",
      "fuelType",
      "pricePerDay",
      "discountPrice",
      "maxDurationDays",
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

exports.deleteVendorBikeService = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await BikeService.findById(serviceId).populate(
      "bike",
      "vendor",
    );

    if (!service) {
      throw new Error("Bike service not found");
    }

    if (service.bike.vendor.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    service.isActive = false;
    await service.save();

    // Hard delete
    // await BikeService.findByIdAndDelete(serviceId);

    return;
  } catch (error) {
    throw error;
  }
};
