const express = require("express");
const router = express.Router();
const serviceController = require("./service.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

router.get("/:id", serviceController.getServiceDetails);

//vendor
router.post(
  "/vendor/services",
  protect,
  authorize("vendor"),
  serviceController.createService,
);

router.put(
  "/vendor/services/:id",
  protect,
  authorize("vendor"),
  serviceController.updateService,
);

router.delete(
  "/vendor/services/:id",
  protect,
  authorize("vendor"),
  serviceController.deleteService,
);

module.exports = router;
