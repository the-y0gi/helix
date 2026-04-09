const Adventure = require("../category/adventure.model");
const Service = require("../service/service.model");
const mongoose = require("mongoose");
const Tax = require("../../admin/tax/tax.model");

exports.getServiceDetails = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid adventure id");
    }

    const adventure = await Adventure.findOne({
      _id: id,
      isActive: true,
    })
      .select("name category location description images rating")
      .lean();

    if (!adventure) {
      throw new Error("Adventure not found");
    }

    const services = await Service.find({
      adventure: id,
      isActive: true,
    })
      .select("title type basePrice discountPrice meta features itinerary")
      .sort({ basePrice: 1 })
      .lean();

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    const formattedServices = services.map((service) => {
      const effectivePrice =
        service.discountPrice > 0 ? service.discountPrice : service.basePrice;
      const totalTax = Number(
        ((effectivePrice * taxPercentage) / 100).toFixed(2),
      );
      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));

      return {
        ...service,
        taxPercentage,
        totalTax,
        totalPriceWithTax,
      };
    });

    const formattedAdventure = {
      _id: adventure._id,
      name: adventure.name,
      category: adventure.category,
      city: adventure.location?.city,
      description: adventure.description,
      rating: adventure.rating?.average || 0,
      reviews: adventure.rating?.count || 0,
      images: adventure.images || [],
    };

    return {
      adventure: formattedAdventure,
      services: formattedServices,
    };
  } catch (error) {
    throw error;
  }
};

exports.createService = async (data, vendorId) => {
  try {
    const {
      adventureId,
      title,
      type,
      basePrice,
      discountPrice,
      meta,
      features,
      itinerary,
    } = data;

    if (!adventureId || !title || !type || !basePrice) {
      throw new Error("Adventure, title, type and basePrice are required");
    }

    const adventure = await Adventure.findOne({
      _id: adventureId,
      vendor: vendorId,
      isActive: true,
    });

    if (!adventure) {
      throw new Error("Adventure not found or unauthorized");
    }

    //TYPE BASED VALIDATION
    if (type === "distance") {
      if (!meta?.distance) {
        throw new Error("Distance is required for distance type");
      }
    }

    if (type === "time") {
      if (!meta?.duration) {
        throw new Error("Duration is required for time type");
      }
    }

    if (type === "package") {
      if (!meta?.days || !meta?.nights) {
        throw new Error("Days and nights are required for package");
      }

      if (!itinerary || !itinerary.length) {
        throw new Error("Itinerary is required for package");
      }
    }

    const service = await Service.create({
      adventure: adventureId,
      title,
      type,
      basePrice,
      discountPrice,
      meta,
      features,
      itinerary,
    });

    return service;
  } catch (error) {
    throw error;
  }
};

exports.updateService = async (id, data, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }

    const service = await Service.findById(id);
    if (!service) {
      throw new Error("Service not found");
    }

    const adventure = await Adventure.findOne({
      _id: service.adventure,
      vendor: vendorId,
      isActive: true,
    });

    if (!adventure) {
      throw new Error("Unauthorized access");
    }

    const { title, type, basePrice, discountPrice, meta, features, itinerary } =
      data;

    if (type === "distance") {
      if (!meta?.distance) {
        throw new Error("Distance is required");
      }
    }

    if (type === "time") {
      if (!meta?.duration) {
        throw new Error("Duration is required");
      }
    }

    if (type === "package") {
      if (!meta?.days || !meta?.nights) {
        throw new Error("Days and nights required");
      }

      if (!itinerary || !itinerary.length) {
        throw new Error("Itinerary required");
      }
    }

    //Update fields (only if provided)
    if (title !== undefined) service.title = title;
    if (type !== undefined) service.type = type;
    if (basePrice !== undefined) service.basePrice = basePrice;
    if (discountPrice !== undefined) service.discountPrice = discountPrice;
    if (meta !== undefined) service.meta = meta;
    if (features !== undefined) service.features = features;
    if (itinerary !== undefined) service.itinerary = itinerary;

    await service.save();

    return service;
  } catch (error) {
    throw error;
  }
};

exports.deleteService = async (id, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }

    const service = await Service.findById(id);
    if (!service) {
      throw new Error("Service not found");
    }

    const adventure = await Adventure.findOne({
      _id: service.adventure,
      vendor: vendorId,
      isActive: true,
    });

    if (!adventure) {
      throw new Error("Unauthorized access");
    }

    // Delete (soft delete)
    service.isActive = false;
    await service.save();

    //Hard delete
    // await Service.findByIdAndDelete(id);

    return true;
  } catch (error) {
    throw error;
  }
};
