const BikeCompany = require("./bike.model");

// Create Bike Company
exports.createBikeCompany = async (data, vendorId) => {
  try {
    const {
      name,
      location,
      address,
      images = [],
      description,
      features = [],
      coordinates,
    } = data;

    if (!name || !name.trim()) {
      throw new Error("Bike company name is required");
    }

    if (!location || !location.city) {
      throw new Error("Location city is required");
    }

    const bikeCompany = await BikeCompany.create({
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

      vendor: vendorId,
      isActive: true,
    });

    return bikeCompany;
  } catch (error) {
    throw error;
  }
};
