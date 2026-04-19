const CabCompany = require("./cab.model");

exports.createCabCompany = async (data, vendorId) => {
  try {
    const {
      name,
      location,
      description,
      images = [],
      features = [],
      address,
      coordinates,
    } = data;

    if (!name || !name.trim()) {
      throw new Error("Cab company name is required");
    }

    if (!location || !location.city) {
      throw new Error("Location city is required");
    }

    const cab = await CabCompany.create({
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

      description: description?.trim() || "",

      images,
      features,

      vendor: vendorId,
      isActive: true,
    });

    return cab;
  } catch (error) {
    throw error;
  }
};
