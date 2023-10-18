const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "this field is required"],
      trim: true,
    },
    adresse: {
      type: String,
      required: [true, "this field is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "this field is required"],
      minlength: [50, "minimum length is 50 characters"],
      maxlength: [400, "maximum  lenght is 400 characters"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: "https://www.pngkey.com/png/detail/233-2332677_ega-png.png",
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      trim: true,
      ref: "User",
    },
    location: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
