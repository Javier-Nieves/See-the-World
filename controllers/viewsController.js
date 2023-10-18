const Trip = require('../models/tripModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.index = catchAsync(async (req, res) => {
  const trips = await Trip.find();
  res.status(200).render('index', {
    title: 'All trips',
    trips,
  });
});

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Login/Register',
  });
};

exports.getTrip = catchAsync(async (req, res) => {
  const { tripId } = req.params;
  const trip = await Trip.findById(tripId);
  res.status(200).render('trip', {
    title: `Name`,
    trip,
  });
});

exports.newTripPage = catchAsync(async (req, res) => {
  res.status(200).render('createTrip', {
    title: `Create new trip`,
  });
});

exports.newLocations = catchAsync(async (req, res) => {
  res.status(200).render('locationsMap', {
    title: `Add locations`,
    tripId: req.params.tripId,
  });
});
