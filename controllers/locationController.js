const Location = require('../models/locationModel');
const Trip = require('../models/tripModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.allLocations = catchAsync(async (req, res, next) => {
  const locations = await Location.find();
  res.status(200).json({ status: 'success', data: { locations } });
});

exports.addLocation = catchAsync(async (req, res, next) => {
  req.body.trip = req.params.tripId;
  const newLocation = await Location.create(req.body);
  const parentTrip = await Trip.findByIdAndUpdate(
    req.params.tripId,
    { $push: { locations: newLocation.id } },
    { new: true },
  );
  console.log(parentTrip);
  res.status(201).json({ status: 'success', data: { newLocation } });
});
