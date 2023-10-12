const express = require('express');
const locationController = require('../controllers/locationController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(locationController.allLocations)
  .post(locationController.addLocation);

module.exports = router;
