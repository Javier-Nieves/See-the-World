const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const filterBody = require('../utils/filterBody');

exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filterBody(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.search = catchAsync(async (req, res, next) => {
  //   .populate({path: 'reviews',fields: 'review rating user '});
  // prettier-ignore
  const searchRes = await User.find({name: { $regex: new RegExp(req.body.query, 'i') } });
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
    await User.findByIdAndUpdate(req.body.userId, {
      $addToSet: { friends: req.user.id },
    });
  }
  res.status(200).json({ status: 'success', data: { host } });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res
    .status(200)
    .json({ status: 'success', results: users.length, data: { users } });
});
