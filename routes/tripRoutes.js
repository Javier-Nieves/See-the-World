const express = require('express');
const tripController = require('../controllers/tripController');
const authController = require('../controllers/authController');
// const locationController = require('../controllers/locationController');
const locationRouter = require('./locationRoutes');

const router = express.Router();

router.use('/:tripId/locations', locationRouter);
// router.post('/:tripId/locations', locationController.addLocation);

router
  .route('/')
  .get(tripController.getAllTrips)
  .post(authController.protect, tripController.createTrip);

router
  .route('/:tripId')
  .get(tripController.getTrip)
  .patch(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    // tripController.uploadTripImages,
    // tripController.resizeTripImages,
    tripController.updateTrip,
  )
  .delete(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    tripController.deleteTrip,
  );

module.exports = router;
