const express = require('express');
const locationController = require('../controllers/locationController');
const viewsController = require('../controllers/viewsController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(viewsController.newLocations)
  .post(locationController.addLocation);

router.route('/all').get(locationController.allLocations);

module.exports = router;
