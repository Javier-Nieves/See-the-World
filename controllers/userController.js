// const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.search = catchAsync(async (req, res, next) => {
  console.log('req :', req.body);

  const searchRes = 'TEST_DATA';
  res.status(200).json({ status: 'success', data: { searchRes } });
});
