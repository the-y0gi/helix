const express = require("express");
const router = express.Router();
const controller = require("./roomType.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

// Vendor
router.use(protect);
router.post("/", authorize("vendor"), controller.createRoomType);
router.patch("/:id", authorize("vendor"), controller.updateRoomType);

module.exports = router;
