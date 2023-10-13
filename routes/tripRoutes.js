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

module.exports = router;
