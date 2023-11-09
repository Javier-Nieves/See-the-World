const express = require('express');
const locationController = require('../controllers/locationController');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const photoUpload = require('../utils/photoUpload');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(viewsController.newLocations)
  .post(
    authController.protect,
    photoUpload.uploadImages,
    photoUpload.resizeImages,
    locationController.addLocation,
  );

router
  .route('/:locationId')
  .patch(
    authController.protect,
    // authController.restrictTo,
    locationController.editLocation,
  )
  .delete(
    authController.protect,
    // authController.restrictTo,
    locationController.deleteLocation,
  );

router.route('/all').get(locationController.allLocations);

module.exports = router;
