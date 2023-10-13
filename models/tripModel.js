const mongoose = require('mongoose');
const slugify = require('slugify');

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A trip must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A trip name must have less or equal then 40 characters'],
    minlength: [8, 'A trip name must have more or equal then 8 characters'],
  },
  travelers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  highlight: String,
  date: {
    type: Date,
    required: [true, 'A trip must have a date'],
  },
  duration: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  private: {
    type: Boolean,
    default: true,
  },
  coverImage: String,
  locations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },
  ],
});

tripSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tripSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'travelers',
    select: 'name photo',
  });
  next();
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
