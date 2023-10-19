const Trip = require('../models/tripModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.index = catchAsync(async (req, res) => {
  // if user is not authentificated
  if (!res.locals.user)
    res.status(200).render('startPage', {
      title: `Welcome to 'See the World' website`,
    });

  const trips = await Trip.find({ createdBy: res.locals.user.id });
  res.status(200).render('index', {
    title: `All trips of ${res.locals.user.name}`,
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
    title: `${trip.name}`,
    trip,
  });
});

exports.newTripPage = catchAsync(async (req, res) => {
  res.status(200).render('createTrip', {
    title: `Create new trip`,
  });
});

exports.newLocations = catchAsync(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);
  res.status(200).render('locationsMap', {
    title: `Add locations`,
    trip,
  });
});
