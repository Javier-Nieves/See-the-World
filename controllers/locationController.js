const Location = require('../models/locationModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.allLocations = catchAsync(async (req, res, next) => {
  const locations = await Location.find();
  res.status(200).json({ status: 'success', data: { locations } });
});

exports.addLocation = catchAsync(async (req, res, next) => {
  req.body.trip = req.params.tripId;
  const newLocation = await Location.create(req.body);
  res.status(201).json({ status: 'success', data: { newLocation } });
});
