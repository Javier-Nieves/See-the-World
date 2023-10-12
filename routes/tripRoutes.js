const express = require('express');
const tripController = require('../controllers/tripController');

const router = express.Router();

router
  .route('/')
  .get(tripController.getAllTrips)
  .post(tripController.createTrip);

module.exports = router;
