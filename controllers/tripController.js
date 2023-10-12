const catchAsync = require('../utils/catchAsync');
const Trip = require('../models/tripModel');

exports.getAllTrips = catchAsync(async (req, res, next) => {
  const trips = await Trip.find();
  res.status(200).json({ status: 'success', data: { trips } });
});

exports.createTrip = catchAsync(async (req, res, next) => {
  const newTrip = await Trip.create(req.body);
  res.status(201).json({ status: 'success', data: { newTrip } });
});
