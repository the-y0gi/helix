const express = require("express");
const router = express.Router();
const tourServiceController = require("./tourService.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

//user side

router.get("/", tourServiceController.getTours);
router.get("/:id", tourServiceController.getTourServiceDetails);

router.get("/company/:id", tourServiceController.getCompanyDetails);

//vendor routes...
router.post(
  "/vendor/tour-services",
  protect,
  authorize("vendor"),
  tourServiceController.createTourService,
);

router.get(
  "/vendor/tour-services",
  protect,
  authorize("vendor"),
  tourServiceController.getVendorTourServices,
);

router.get(
  "/vendor/tour-services/:id",
  protect,
  authorize("vendor"),
  tourServiceController.getVendorTourServiceById,
);

router.put(
  "/vendor/tour-services/:id",
  protect,
  authorize("vendor"),
  tourServiceController.updateVendorTourService,
);

router.delete(
  "/vendor/tour-services/:id",
  protect,
  authorize("vendor"),
  tourServiceController.deleteVendorTourService,
);

module.exports = router;
