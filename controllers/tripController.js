const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Trip = require('../models/tripModel');
const Location = require('../models/locationModel');

exports.getAllTrips = catchAsync(async (req, res, next) => {
  const trips = await Trip.find();
  res
    .status(200)
    .json({ status: 'success', results: trips.length, data: { trips } });
});

exports.createTrip = catchAsync(async (req, res, next) => {
  req.body.travelers = [];
  req.body.travelers.push(req.user.id);
  const newTrip = await Trip.create(req.body);
  res.status(201).json({ status: 'success', data: { newTrip } });
});

exports.getTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);
  res.status(200).json({ status: 'success', data: { trip } });
});

exports.updateTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findByIdAndUpdate(req.params.tripId, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: 'success', data: { trip } });
});

exports.deleteTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findByIdAndDelete(req.params.tripId);
  if (!trip) return next(new AppError('No document found with that ID', 404));

  await Location.deleteMany({ trip: req.params.tripId });

  res.status(204).json({ status: 'success', data: null });
});
