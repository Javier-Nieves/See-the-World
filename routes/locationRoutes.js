const express = require('express');
const locationController = require('../controllers/locationController');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(viewsController.newLocations)
  // .post(locationController.addLocation)
  .post(
    authController.protect,
    locationController.uploadImages,
    locationController.resizeImages,
    locationController.addLocation,
  );

router.route('/:locationId').patch(
  // authController.protect,
  // authController.restrictTo,
  locationController.editLocation,
);

router.route('/all').get(locationController.allLocations);

module.exports = router;
