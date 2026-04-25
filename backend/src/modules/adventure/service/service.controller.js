const logger = require("../../../shared/utils/logger");
const serviceService = require("./service.service");

exports.getServiceDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await serviceService.getServiceDetails(id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getServiceDetails", error);
    next(error);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const service = await serviceService.createService(req.body, vendorId);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: createService", error);
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const { id } = req.params;

    const service = await serviceService.updateService(id, req.body, vendorId);

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: updateService", error);
    next(error);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const { id } = req.params;

    await serviceService.deleteService(id, vendorId);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteService", error);
    next(error);
  }
};
