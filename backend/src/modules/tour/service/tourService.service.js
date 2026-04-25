const mongoose = require("mongoose");
const TourService = require("./tourService.model");
const TourCompany = require("../company/tour.model");

exports.createTourService = async (data, vendorId) => {
  try {
    const {
      tourId,
      title,
      destinations = [],
      duration,
      basePrice,
      discountPrice = 0,
      description,
      features = [],
      images = [],
      itinerary = [],
      meta = {},
      maxPeople = 10,
    } = data;

    if (!tourId || !mongoose.Types.ObjectId.isValid(tourId)) {
      throw new Error("Valid tourId is required");
    }

    if (!title) throw new Error("Title is required");

    if (!duration?.days || !duration?.nights) {
      throw new Error("Duration (days & nights) is required");
    }

    if (!basePrice || basePrice < 0) {
      throw new Error("Valid base price is required");
    }

    if (discountPrice > basePrice) {
      throw new Error("Discount cannot exceed base price");
    }

    const tourCompany = await TourCompany.findOne({
      _id: tourId,
      vendor: vendorId,
      isActive: true,
    });

    if (!tourCompany) {
      throw new Error("Tour company not found or unauthorized");
    }

    if (!Array.isArray(itinerary) || itinerary.length === 0) {
      throw new Error("Itinerary is required");
    }

    if (itinerary.length !== duration.days) {
      throw new Error("Itinerary days must match duration days");
    }

    itinerary.forEach((day, index) => {
      if (!day.day || day.day !== index + 1) {
        throw new Error("Invalid itinerary day sequence");
      }
    });

    const service = await TourService.create({
      tour: tourId,

      title: title.trim(),
      destinations,

      duration,

      basePrice,
      discountPrice,

      description: description?.trim() || "",
      features,
      images,

      itinerary,
      meta,
      maxPeople,

      isActive: true,
    });

    return service;
  } catch (error) {
    throw error;
  }
};

exports.getVendorTourServices = async (query = {}, vendorId) => {
  try {
    const { tourId, search, page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const companies = await TourCompany.find({ vendor: vendorId })
      .select("_id")
      .lean();

    const tourIds = companies.map((c) => c._id);

    const filter = {
      tour: { $in: tourIds },
    };

    if (tourId) {
      filter.tour = tourId;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const services = await TourService.find(filter)
      .populate("tour", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await TourService.countDocuments(filter);

    const formatted = services.map((s) => ({
      id: s._id,

      title: s.title,

      company: s.tour?.name || null,

      destinations: s.destinations,

      duration: `${s.duration.days}D / ${s.duration.nights}N`,

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

exports.getVendorTourServiceById = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await TourService.findById(serviceId)
      .populate("tour", "name vendor")
      .lean();

    if (!service) {
      throw new Error("Tour service not found");
    }

    if (service.tour.vendor.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    const formatted = {
      id: service._id,

      company: {
        id: service.tour._id,
        name: service.tour.name,
      },

      title: service.title,

      destinations: service.destinations || [],

      duration: service.duration,

      pricing: {
        basePrice: service.basePrice,
        discountPrice: service.discountPrice,
      },

      description: service.description || "",

      features: service.features || [],

      images: service.images || [],

      itinerary: service.itinerary || [],

      meta: service.meta || {},

      maxPeople: service.maxPeople,

      isActive: service.isActive,

      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    return formatted;
  } catch (error) {
    throw error;
  }
};

exports.updateVendorTourService = async (serviceId, vendorId, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await TourService.findById(serviceId).populate(
      "tour",
      "vendor",
    );

    if (!service) {
      throw new Error("Tour service not found");
    }

    if (service.tour.vendor.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    if (data.basePrice !== undefined && data.basePrice < 0) {
      throw new Error("Invalid base price");
    }

    if (
      data.discountPrice !== undefined &&
      data.basePrice !== undefined &&
      data.discountPrice > data.basePrice
    ) {
      throw new Error("Discount cannot exceed base price");
    }

    //ITINERARY + DURATION VALIDATION
    if (data.itinerary || data.duration) {
      const finalDays = data.duration?.days || service.duration.days;
      const itinerary = data.itinerary || service.itinerary;

      if (itinerary.length !== finalDays) {
        throw new Error("Itinerary days must match duration days");
      }

      itinerary.forEach((day, index) => {
        if (!day.day || day.day !== index + 1) {
          throw new Error("Invalid itinerary sequence");
        }
      });

      service.itinerary = itinerary;
      service.duration = data.duration || service.duration;
    }

    const allowedFields = [
      "title",
      "destinations",
      "basePrice",
      "discountPrice",
      "description",
      "features",
      "images",
      "meta",
      "maxPeople",
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

exports.deleteTourService = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await TourService.findById(serviceId).populate(
      "tour",
      "vendor",
    );

    if (!service) {
      throw new Error("Tour service not found");
    }

    if (service.tour.vendor.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    // SOFT DELETE
    service.isActive = false;
    await service.save();

    // Hard delete
    // await TourService.findByIdAndDelete(serviceId);

    return;
  } catch (error) {
    throw error;
  }
};
