const Location = require('../models/locationModel');
const Trip = require('../models/tripModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterBody = require('../utils/filterBody');

exports.addLocation = catchAsync(async (req, res, next) => {
  // prettier-ignore
  const filteredBody = filterBody(req.body, 'name', 'address', 
                                  'description', 'coordinates', 'images');
  filteredBody.trip = req.params.tripId;
  filteredBody.coordinates = filteredBody.coordinates.split(',');

  const newLocation = await Location.create(filteredBody);
  await Trip.findByIdAndUpdate(
    req.params.tripId,
    { $push: { locations: newLocation.id } },
    { new: true },
  );
  res.status(201).json({ status: 'success', data: { newLocation } });
});

exports.editLocation = catchAsync(async (req, res, next) => {
  // prettier-ignore
  const filteredBody = filterBody(req.body, 'name', 'address', 
                                  'description', 'coordinates', 'images');
  const modifiedLocation = await Location.findByIdAndUpdate(
    req.params.locationId,
    filteredBody,
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
