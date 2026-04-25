const express = require("express");
const router = express.Router();
const cabServiceController = require("./cabService.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

//user side...

router.get("/", cabServiceController.getCabs);
router.get("/:id", cabServiceController.getCabServiceDetails);

router.get("/company/:id", cabServiceController.getCabCompanyDetails);


//vendor routes...

router.post(
  "/vendor/cab-services",
  protect,
  authorize("vendor"),
  cabServiceController.createCabService,
);

router.get(
  "/vendor/cab-services",
  protect,
  authorize("vendor"),
  cabServiceController.getVendorCabServices,
);

router.get(
  "/vendor/cab-services/:id",
  protect,
  authorize("vendor"),
  cabServiceController.getVendorCabServiceById,
);

router.put(
  "/vendor/cab-services/:id",
  protect,
  authorize("vendor"),
  cabServiceController.updateVendorCabService,
);

router.delete(
  "/vendor/cab-services/:id",
  protect,
  authorize("vendor"),
  cabServiceController.deleteVendorCabService,
);

module.exports = router;
