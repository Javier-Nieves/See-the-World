const mongoose = require("mongoose");

const tripScheema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A trip must have a name"],
    unique: true,
    trim: true,
    maxlength: [40, "A trip name must have less or equal then 40 characters"],
    minlength: [8, "A trip name must have more or equal then 8 characters"],
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "A trip must have a date"],
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
  coverImage: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  locations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
  ],
});

const Trip = mongoose.model("Trip", tripScheema);

module.exports = Trip;
