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
  const host = await User.findByIdAndUpdate(
    req.body.hostId,
    { $addToSet: { friendRequests: req.body.askId } },
    { new: true },
  );

  res.status(200).json({ status: 'success', data: { host } });
});
