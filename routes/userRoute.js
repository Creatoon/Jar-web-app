const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.get('/logout', authController.logOut);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);

router.delete('/deleteMe', userController.deleteMe);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  // userController.resizeUserPhoto,
  userController.updateMe
);

router.patch('/updateMyPassword', authController.updatePassword);

// Only Admins Can Do The Jobs Below This
//router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
