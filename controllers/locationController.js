const Location = require('../models/locationModel');
const Trip = require('../models/tripModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.addLocation = catchAsync(async (req, res, next) => {
  req.body.trip = req.params.tripId;
  req.body.coordinates = req.body.coordinates.split(',');

  const newLocation = await Location.create(req.body);
  await Trip.findByIdAndUpdate(
    req.params.tripId,
    { $push: { locations: newLocation.id } },
    { new: true },
  );
  res.status(201).json({ status: 'success', data: { newLocation } });
});

exports.editLocation = catchAsync(async (req, res, next) => {
  const modifiedLocation = await Location.findByIdAndUpdate(
    req.params.locationId,
    req.body,
    { new: true, runValidators: true },
  );
  res.status(200).json({ status: 'success', data: { modifiedLocation } });
});

exports.deleteLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findByIdAndDelete(req.params.locationId);
  if (!location)
    return next(new AppError('No document found with that ID', 404));

  res.status(204).json({ status: 'success', data: null });
});

exports.allLocations = catchAsync(async (req, res, next) => {
  const locations = await Location.find();
  res.status(200).json({
    status: 'success',
    results: locations.length,
    data: { locations },
  });
});
