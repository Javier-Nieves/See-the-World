const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// configure image processing library:
const multerStorage = multer.memoryStorage();
// checks if uploaded files are images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image', 400), false);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadImages = upload.single('photo');
exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterBody = (obj, ...allowedFields) => {
  // clear all unwanted fields from an object. For security
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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
  try {
    console.log('searching..');
    //   .populate({path: 'reviews',fields: 'review rating user '});
    const searchRes = await User.find({
      name: { $regex: new RegExp(req.body.query, 'i') },
    }).select('-password -__v -slug -role -active');
    console.log('response', res);
    res.status(200).json({ status: 'success', data: { searchRes } });
  } catch (err) {
    console.error('error', err);
  }
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
