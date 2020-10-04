const express = require('express');

const authController = require('./../controllers/authController');
const roomController = require('../controllers/roomController');

const router = express.Router();

router
  .route('/')
  .get(roomController.getAllRooms)
  .post(
    authController.protect,
    roomController.uploadRoomPhoto,
    roomController.resizeRoomPhoto,
    roomController.createRoom
  );

router
  .route('/:id')
  .get(roomController.getOneRoomById)
  .patch(roomController.updateRoom);

router.route('/name/:name').get(roomController.getRoomsByName);

module.exports = router;
