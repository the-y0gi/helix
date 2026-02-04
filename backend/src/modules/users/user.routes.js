const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { protect } = require('../../shared/middlewares/verifyToken');

router.use(protect);

router.get('/me', userController.getMe);
router.patch('/update-me', userController.updateMe);

module.exports = router;