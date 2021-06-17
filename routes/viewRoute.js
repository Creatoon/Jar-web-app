const express = require('express');

// Our Own Modules
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const roomController = require('../controllers/roomController');

//const userController = require('../controllers/userController');

// Router Creation
const router = express.Router({ mergeParams: true });

//router.get('/me', authController.protect, userController.getMe);

router.get('/', viewController.getSignupPage);

router.get('/room/default', authController.protect, viewController.getRoom);

router.get('/me', authController.protect, viewController.getMe);

router.get(
  '/room/:id',
  authController.protect,
  roomController.getRoomByIdForRendering,
  authController.checkValidUser,
  viewController.getAnotherRoom
);

router.get(
  '/join/:roomid',
  authController.protect,
  roomController.getRoomByIdForRendering,
  viewController.getProposalpage
);

router.get(
  '/createRoom',
  authController.protect,
  viewController.getCreateRoomPage
);

router.get('/home', viewController.getHomePage);
router.get('/login', authController.isLoggedIn, viewController.getLogin);
router.get('/logout', authController.logOut);
router.get('/signup', authController.isLoggedIn, viewController.getSignupPage);
//router.get('/room/:roomId', chatController.getAnotherRoom);

module.exports = router;
