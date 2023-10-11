const mongoose = require("mongoose");

const locationScheema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A location must have a name"],
    trim: true,
    maxlength: [40, "Name is too long"],
    minlength: [8, "A location name must have more or equal then 8 characters"],
  },
  description: {
    type: String,
    trim: true,
  },
});

const Location = mongoose.model("Location", locationScheema);

module.exports = Location;
