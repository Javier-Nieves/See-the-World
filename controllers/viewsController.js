const Trip = require('../models/tripModel');
const User = require('../models/userModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.index = catchAsync(async (req, res) => {
  const visitorId = res.locals?.user?.id;
  let userId;
  let visitor;
  // if user is not authentificated
  if (!res.locals.user)
    res.status(200).render('startPage', {
      title: `Welcome`,
    });

  // if user's trips are summoned UserId will be the URL parameter
  // otherwise logged in user's trips will be shown
  if (req.params.userId) ({ userId } = req.params);
  else userId = visitorId;

  const owner = await User.findById(userId);
  if (userId !== visitorId) visitor = await User.findById(visitorId);
  else visitor = owner;

  // todo - change createdBy to 'in the travelers array'
  const trips = await Trip.find({ createdBy: userId });
  res.status(200).render('index', {
    owner,
    visitor,
    trips,
  });
});

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Login/Register',
  });
};

exports.myProfile = (req, res) => {
  res.status(200).render('userProfile', {
    title: 'My profile',
    user: res.locals.user,
  });
};

exports.myFriends = (req, res) => {
  res.status(200).render('friendsPage', {
    title: 'My friends',
    user: res.locals.user,
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

exports.fillTripInfo = catchAsync(async (req, res) => {
  let title;
  let trip = '';
  const user = await User.findById(req.user.id);
  if (req.url.includes('edit')) {
    title = 'Edit trip info';
    const { tripId } = req.params;
    trip = await Trip.findById(tripId);
  } else title = 'Create new trip';
  res.status(200).render('fillTripInfo', {
    title,
    trip,
    user,
  });
});

exports.newLocations = catchAsync(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);
  res.status(200).render('locationsMap', {
    title: `Add locations`,
    trip,
  });
});
