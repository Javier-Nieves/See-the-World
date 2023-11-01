const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getAll = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res
    .status(200)
    .json({ status: 'success', results: users.length, data: { users } });
});

exports.search = catchAsync(async (req, res, next) => {
  //   .populate({path: 'reviews',fields: 'review rating user '});
  const searchRes = await User.find({
    name: { $regex: new RegExp(req.body.query, 'i') },
  }).select('-password -__v -slug -role -active');
  res.status(200).json({ status: 'success', data: { searchRes } });
});

exports.friendRequest = catchAsync(async (req, res, next) => {
  let host;

  // if friend request is send:
  if (req.body.action === 'send')
    host = await User.findByIdAndUpdate(
      req.body.hostId,
      { $addToSet: { friendRequests: req.user.id } },
      { new: true },
    );

  // if user accepts a friend request:
  if (req.body.action === 'accept') {
    host = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { friends: req.body.userId },
        $pull: { friendRequests: req.body.userId },
      },
      { new: true },
    );
  }
  res.status(200).json({ status: 'success', data: { host } });
});
