const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.index);
router.get('/users/:userId', viewsController.index);
router.get('/me', authController.protect, viewsController.myProfile);
router.get('/friends', authController.protect, viewsController.myFriends);
router.get(
  '/friendsTrips',
  authController.protect,
  viewsController.friendsTrips,
);
router.get('/searchTrips/:query', viewsController.searchTrips);
router.get('/login', viewsController.login);
router.get('/trips/:tripId', viewsController.getTrip);
router.get('/trips/:tripId/locations', viewsController.newLocations);
router.get('/createTrip', authController.protect, viewsController.fillTripInfo);
router.get(
  '/trips/:tripId/edit',
  authController.protect,
  viewsController.fillTripInfo,
);
router.get('/getKeys', authController.getKeys);

module.exports = router;
