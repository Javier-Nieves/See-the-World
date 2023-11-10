const express = require('express');
const tripController = require('../controllers/tripController');
const authController = require('../controllers/authController');
const locationRouter = require('./locationRoutes');
const photoUpload = require('../utils/photoUpload');

const router = express.Router();

router.use('/:tripId/locations', locationRouter);

router
  .route('/')
  .get(tripController.getAllTrips)
  .post(
    authController.protect,
    photoUpload.uploadCoverImage,
    photoUpload.resizeOneImage,
    tripController.createTrip,
  );

router
  .route('/:tripId')
  .get(tripController.getTrip)
  .patch(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    photoUpload.uploadCoverImage,
    photoUpload.resizeOneImage,
    tripController.updateTrip,
  )
  .delete(authController.protect, tripController.deleteTrip);

module.exports = router;
