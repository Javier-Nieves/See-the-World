const multer = require('multer');
const sharp = require('sharp');
const AppError = require('./appError');
const catchAsync = require('./catchAsync');

// configure image processing library:
const multerStorage = multer.memoryStorage();
// checks if uploaded files are images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image', 400), false);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// when uploading - FormData should be send to the server and
// 'photo' is the name in the FormData. NOT in the HTML
exports.uploadOneImage = upload.single('photo');
exports.uploadCoverImage = upload.single('coverImage');

exports.uploadImages = upload.array('images', 10);

exports.resizeOneImage = catchAsync(async (req, res, next) => {
  // used for trip thumbnail or user's profile picture
  if (!req.file) return next();

  const tripRelated = req.originalUrl.includes('trips');
  // prettier-ignore
  req.file.filename = `${tripRelated ? 'trip' : 'user'}-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(
      `public/img/${tripRelated ? 'trips' : 'users'}/${req.file.filename}`,
    );

  next();
});

exports.resizeImages = catchAsync(async (req, res, next) => {
  // used for location photos
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
