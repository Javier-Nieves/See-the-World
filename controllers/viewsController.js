const Trip = require('../models/tripModel');
const User = require('../models/userModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.index = catchAsync(async (req, res) => {
  const visitorId = res.locals?.user?.id;
  let userId;
  let visitor;
  let trips;
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

  //! visiting user's page:
  if (userId !== visitorId) {
    // find visitor user
    visitor = await User.findById(visitorId);
    // if it's a friend of the owner - show private tours also
    if (owner.friends.includes(visitorId))
      trips = await Trip.find({ travelers: { $in: [userId] } }).sort([
        ['date', -1],
      ]);
    else
      trips = await Trip.find({
        travelers: { $in: [userId] },
        private: false,
      }).sort([['date', -1]]);
    //! my own page:
  } else {
    visitor = owner;
    // prettier-ignore
    trips = await Trip.find({ travelers: { $in: [userId] } }).sort([['date', -1]]);
  }
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

exports.myProfile = async (req, res) => {
  res.status(200).render('userProfile', {
    title: 'My profile',
    user: res.locals.user,
  });
};

exports.myFriends = async (req, res) => {
  // prettier-ignore
  let user = await User.findById(res.locals.user.id).populate({ path: 'friends' });
  user = await user.populate({ path: 'friendRequests' });
  res.status(200).render('friendsPage', {
    title: 'My friends',
    user,
  });
};

exports.friendsTrips = async (req, res) => {
  const user = await User.findById(res.locals.user.id);
  // create array of friends' IDs and add user's ID to display own trips as well
  const idArray = user.friends;
  idArray.push(user._id);

  const trips = await Trip.find({
    travelers: { $in: idArray },
  }).sort([['createdAt', -1]]);

  res.status(200).render('searchTrips', {
    title: 'New trips of my friends',
    trips,
    user,
  });
};

exports.searchTrips = catchAsync(async (req, res, next) => {
  // 'i' - for case-insensitive search
  const trips = await Trip.find({
    $or: [
      { name: { $regex: new RegExp(req.params.query, 'i') } },
      { highlight: { $regex: new RegExp(req.params.query, 'i') } },
    ],
  });
  res.status(200).render('searchTrips', {
    title: 'Search results',
    trips,
  });
});

exports.getTrip = catchAsync(async (req, res) => {
  const { tripId } = req.params;
  const trip = await Trip.findById(tripId);
  // sending visitorId to decide if they could change trip info
  const visitorId = res.locals?.user?.id;
  res.status(200).render('trip', {
    title: `${trip.name}`,
    trip,
    visitorId,
  });
});

exports.fillTripInfo = catchAsync(async (req, res) => {
  let title;
  let trip = '';
  const user = await User.findById(req.user.id).populate({ path: 'friends' });
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
