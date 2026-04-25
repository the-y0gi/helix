const express = require("express");
const router = express.Router();
const bikeServiceController = require("./bikeService.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

//vendor routes...
router.post(
  "/vendor/bike-services",
  protect,
  authorize("vendor"),
  bikeServiceController.createBikeService,
);

router.get(
  "/vendor/bike-services",
  protect,
  authorize("vendor"),
  bikeServiceController.getVendorBikeServices,
);

router.get(
  "/vendor/bike-services/:id",
  protect,
  authorize("vendor"),
  bikeServiceController.getVendorBikeServiceById,
);

router.put(
  "/vendor/bike-services/:id",
  protect,
  authorize("vendor"),
  bikeServiceController.updateVendorBikeService,
);

router.delete(
  "/vendor/bike-services/:id",
  protect,
  authorize("vendor"),
  bikeServiceController.deleteVendorBikeService,
);

module.exports = router;
