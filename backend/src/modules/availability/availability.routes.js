const express = require("express");
const router = express.Router();
const controller = require("./availability.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

// User side (check calendar)
router.get("/", controller.getAvailability);

// Vendor side (manage calendar)
router.use(protect);
router.post("/", authorize("vendor"), controller.setAvailability);

module.exports = router;
