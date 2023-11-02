const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadImages,
  userController.resizeImages,
  userController.updateMe,
);

router.get('/all', userController.getAll);

router.post('/search', userController.search);
router.post('/friends', authController.protect, userController.friendRequest);

module.exports = router;
