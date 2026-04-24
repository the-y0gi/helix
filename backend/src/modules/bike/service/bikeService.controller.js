const bikeService = require("./bikeService.service");
const logger = require("../../../shared/utils/logger");

exports.createBikeService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const service = await bikeService.createBikeService(req.body, vendorId);

    res.status(201).json({
      success: true,
      message: "Bike service created successfully",
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: createBikeService", error);
    next(error);
  }
};

exports.getVendorBikeServices = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const result = await bikeService.getVendorBikeServices(req.query, vendorId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorBikeServices", error);
    next(error);
  }
};

exports.getVendorBikeServiceById = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const serviceId = req.params.id;

    const service = await bikeService.getVendorBikeServiceById(
      serviceId,
      vendorId,
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorBikeServiceById", error);
    next(error);
  }
};

exports.updateVendorBikeService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const serviceId = req.params.id;

    const updated = await bikeService.updateVendorBikeService(
      serviceId,
      vendorId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Bike service updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error("Controller Error: updateBikeService", error);
    next(error);
  }
};

exports.deleteVendorBikeService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const serviceId = req.params.id;

    await bikeService.deleteVendorBikeService(serviceId, vendorId);

    res.status(200).json({
      success: true,
      message: "Bike service deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteBikeService", error);
    next(error);
  }
};
