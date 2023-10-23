const multer = require('multer');
const sharp = require('sharp');
const Location = require('../models/locationModel');
const Trip = require('../models/tripModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();
// checks if uploaded files are images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadImages = upload.array('images', 10); // upload.single('photo');

exports.resizeImages = catchAsync(async (req, res, next) => {
  console.log('photo resize:', req.files);
  if (!req.files) return next();

  req.body.images = [];

  // here every element of the 'map' returns a promise and code needs to be awaited
  await Promise.all(
    req.files.map(async (img, i) => {
      const filename = `trip-${req.params.tripId}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(img.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/locations/${filename}`);

      req.body.images.push(filename);
    }),
  );
  next();
});

exports.addLocation = catchAsync(async (req, res, next) => {
  req.body.trip = req.params.tripId;
  req.body.coordinates = req.body.coordinates.split(',');

  const newLocation = await Location.create(req.body);
  const parentTrip = await Trip.findByIdAndUpdate(
    req.params.tripId,
    { $push: { locations: newLocation.id } },
    { new: true },
  );
  console.log(parentTrip);
  res.status(201).json({ status: 'success', data: { newLocation } });
});

exports.allLocations = catchAsync(async (req, res, next) => {
  const locations = await Location.find();
  res.status(200).json({ status: 'success', data: { locations } });
});
