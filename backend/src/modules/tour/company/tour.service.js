const TourCompany = require("./tour.model");

exports.createTourCompany = async (data, vendorId) => {
  try {
    const {
      name,
      location,
      address,
      coordinates,
      images = [],
      description,
      features = [],
      tags = [],
    } = data;

    if (!name || !name.trim()) {
      throw new Error("Tour company name is required");
    }

    if (!location || !location.city) {
      throw new Error("Location city is required");
    }

    const tourCompany = await TourCompany.create({
      name: name.trim(),

      location: {
        city: location.city.trim(),
        state: location.state || "",
        country: location.country || "India",
      },

      address: address?.trim() || "",

      coordinates: {
        lat: coordinates?.lat || null,
        lng: coordinates?.lng || null,
      },

      images,
      description: description?.trim() || "",
      features,
      tags,

      vendor: vendorId,
      isActive: true,
    });

    return tourCompany;
  } catch (error) {
    throw error;
  }
};
