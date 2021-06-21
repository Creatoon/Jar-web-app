const express = require('express');

const chatController = require('./../controllers/messageController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, chatController.getAllChats);

router
  .route('/:id')
  .get(authController.protect, chatController.getOneChat)
  .delete(authController.protect, chatController.deleteChat);

module.exports = router;
