const logger = require("../../../shared/utils/logger");
const adventureService = require("./adventure.service");

exports.searchAdventures = async (req, res, next) => {
  try {
    const categories = await adventureService.searchAdventures(req.query);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    logger.error("Controller Error: searchAdventures", error);
    next(error);
  }
};

exports.getAdventures = async (req, res, next) => {
  try {
    const adventures = await adventureService.getAdventures(req.query);

    res.status(200).json({
      success: true,
      count: adventures.length,
      data: adventures,
    });
  } catch (error) {
    logger.error("Controller Error: getAdventures", error);
    next(error);
  }
};

exports.getAdventureDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await adventureService.getAdventureDetails(id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getAdventureDetails", error);
    next(error);
  }
};

///vendor

exports.createAdventure = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const adventure = await adventureService.createAdventure(
      req.body,
      vendorId,
    );

    res.status(201).json({
      success: true,
      data: adventure,
    });
  } catch (error) {
    logger.error("Controller Error: createAdventure", error);
    next(error);
  }
};

exports.getVendorAdventures = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const adventures = await adventureService.getVendorAdventures(vendorId);

    res.status(200).json({
      success: true,
      count: adventures.length,
      data: adventures,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorAdventures", error);
    next(error);
  }
};

exports.getVendorAdventureDetails = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const { id } = req.params;

    const data = await adventureService.getVendorAdventureDetails(id, vendorId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorAdventureDetails", error);
    next(error);
  }
};

exports.updateAdventure = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const { id } = req.params;

    const adventure = await adventureService.updateAdventure(
      id,
      req.body,
      vendorId,
    );

    res.status(200).json({
      success: true,
      data: adventure,
    });
  } catch (error) {
    logger.error("Controller Error: updateAdventure", error);
    next(error);
  }
};

exports.deleteAdventure = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const { id } = req.params;

    await adventureService.deleteAdventure(id, vendorId);

    res.status(200).json({
      success: true,
      message: "Adventure deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteAdventure", error);
    next(error);
  }
};
