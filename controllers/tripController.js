const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterBody = require('../utils/filterBody');
const Trip = require('../models/tripModel');
const Location = require('../models/locationModel');

exports.getAllTrips = catchAsync(async (req, res, next) => {
  const trips = await Trip.find();
  res
    .status(200)
    .json({ status: 'success', results: trips.length, data: { trips } });
});

exports.createTrip = catchAsync(async (req, res, next) => {
  // only save fields are allowed:
  // prettier-ignore
  const filteredBody = filterBody(req.body, 'name', 'date', 'travelers', 'duration',
                                            'highlight', 'description', 'private' );
  // add information about cover image
  if (req.file) filteredBody.coverImage = req.file.filename;
  // prettier-ignore
  filteredBody.travelers = filteredBody.travelers ? filteredBody.travelers.split(',') : [];
  filteredBody.travelers.push(req.user.id);
  filteredBody.createdBy = req.user.id;

  const newTrip = await Trip.create(filteredBody);
  res.status(201).json({ status: 'success', data: { newTrip } });
});

exports.getTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findById(req.params.tripId);
  res.status(200).json({ status: 'success', data: { trip } });
});

exports.updateTrip = catchAsync(async (req, res, next) => {
  // prettier-ignore
  const filteredBody = filterBody(req.body, 'name', 'date', 'travelers', 'duration',
                                            'highlight', 'description', 'private' );
  filteredBody.travelers = filteredBody.travelers.split(',');
  if (req.file) filteredBody.coverImage = req.file.filename;

  const trip = await Trip.findByIdAndUpdate(req.params.tripId, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: 'success', data: { trip } });
});

exports.deleteTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findByIdAndDelete(req.params.tripId);
  if (!trip) return next(new AppError('No document found with that ID', 404));

  await Location.deleteMany({ trip: req.params.tripId });
  // todo - delete all photos (trip + all locations) at this point

  res.status(204).json({ status: 'success', data: null });
});

exports.search = catchAsync(async (req, res, next) => {
  // prettier-ignore
  const searchRes = await Trip.find({name: { $regex: new RegExp(req.body.query, 'i') } });
  res.status(200).json({ status: 'success', data: { searchRes } });
});
