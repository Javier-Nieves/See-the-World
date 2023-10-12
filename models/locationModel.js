const mongoose = require('mongoose');

const locationScheema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A location must have a name'],
    trim: true,
    maxlength: [40, 'Name is too long'],
    minlength: [8, 'A location name must have more or equal then 8 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  trip: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Location must belong to a trip'],
    },
  ],
  type: {
    type: String,
    default: 'Point',
    enum: ['Point'],
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function (array) {
        // Ensure that the array is not empty
        return array && array.length === 2;
      },
      message: 'Location must have coordinates',
    },
  },
  address: String,
});

const Location = mongoose.model('Location', locationScheema);

module.exports = Location;
