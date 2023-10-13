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
