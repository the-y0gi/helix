const cabService = require("./cabService.service");
const logger = require("../../../shared/utils/logger");

exports.createCabService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const service = await cabService.createCabService(req.body, vendorId);

    res.status(201).json({
      success: true,
      message: "Cab service created successfully",
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: createCabService", error);
    next(error);
  }
};

exports.getVendorCabServices = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const result = await cabService.getVendorCabServices(req.query, vendorId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorCabServices", error);
    next(error);
  }
};

exports.getVendorCabServiceById = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const serviceId = req.params.id;

    const service = await cabService.getVendorCabServiceById(
      serviceId,
      vendorId,
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorCabServiceById", error);
    next(error);
  }
};

exports.updateVendorCabService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const serviceId = req.params.id;

    const updated = await cabService.updateVendorCabService(
      serviceId,
      vendorId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Cab service updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error("Controller Error: updateCabService", error);
    next(error);
  }
};

exports.deleteVendorCabService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const serviceId = req.params.id;

    await cabService.deleteVendorCabService(serviceId, vendorId);

    res.status(200).json({
      success: true,
      message: "Cab service deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteCabService", error);
    next(error);
  }
};
