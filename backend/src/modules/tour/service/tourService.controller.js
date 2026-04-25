const tourService = require("./tourService.service");
const logger = require("../../../shared/utils/logger");

exports.createTourService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const service = await tourService.createTourService(req.body, vendorId);

    res.status(201).json({
      success: true,
      message: "Tour service created successfully",
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: createTourService", error);
    next(error);
  }
};

exports.getVendorTourServices = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const result = await tourService.getVendorTourServices(req.query, vendorId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorTourServices", error);
    next(error);
  }
};

exports.getVendorTourServiceById = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const serviceId = req.params.id;

    const service = await tourService.getVendorTourServiceById(
      serviceId,
      vendorId,
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorTourServiceById", error);
    next(error);
  }
};

exports.updateVendorTourService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const serviceId = req.params.id;

    const updated = await tourService.updateVendorTourService(
      serviceId,
      vendorId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Tour service updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error("Controller Error: updateTourService", error);
    next(error);
  }
};

exports.deleteVendorTourService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const serviceId = req.params.id;

    await tourService.deleteVendorTourService(serviceId, vendorId);

    res.status(200).json({
      success: true,
      message: "Tour service deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteTourService", error);
    next(error);
  }
};
