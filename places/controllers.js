const mongoose = require("mongoose");
const Place = require("../Models/placeModel");
const User = require("../Models/userModel");
const { successResponse, errorResponse } = require("../responses/response");
const geocodeAddress = require("./geocodeAddress");

const getPlaces = async (req, res, next) => {
  try {
    places = await Place.find();

    if (places.length === 0) {
      return next(errorResponse("No Places Found", 404));
    }

    res.json(successResponse("Operation successful", places));
  } catch (error) {
    return next(errorResponse(error.message, 500));
  }
};

const createPlace = async (req, res, next) => {
  const { title, adresse, description, image, creator } = req.body;
  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(errorResponse("Someting went wrong, try again later", 500));
  }

  if (!user) {
    return next(errorResponse("Could not find user with specified ID", 404));
  }

  const coordonates = (await geocodeAddress(adresse)) || {
    lat: 30.4205162,
    lng: -9.5838532,
  };
  try {
    const newPlace = new Place({
      title,
      adresse,
      description,
      image,
      location: coordonates,
      creator,
    });

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newPlace.save({ session: sess });
    user.places.push(newPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();

    res.status(202).json(successResponse("Place created successfully"));
  } catch (error) {
    return next(errorResponse(error.message, 500));
  }
};

const getSinglePlace = async (req, res, next) => {
  const { placeId } = req.params;
  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return next(errorResponse("No Place Found With This id", 404));
    }
    res.json(successResponse("Operation successful", place));
  } catch (error) {
    return next(errorResponse(error.message, 500));
  }
};

const getPlaceByUserId = async (req, res, next) => {
  let userId = req.user._id;
  try {
    const places = await Place.find({ creator: userId });
    if (places.length === 0) {
      return next(errorResponse("No places found with this userId", 404));
    }
    res.json(successResponse("Operation seccessfull", places));
  } catch (error) {
    return next(errorResponse(error.message, 500));
  }
};

const updatePlace = async (req, res, next) => {
  const { placeId } = req.params;
  const { title, description } = req.body;
  try {
    const updatedPlace = await Place.findOneAndUpdate(
      { _id: placeId },
      { $set: { title, description } },
      { new: true, runValidators: true }
    );
    if (!updatedPlace) {
      return next(errorResponse("No Place Found With This id", 404));
    }

    res.json(successResponse("Place updated successfully"));
  } catch (error) {
    return next(errorResponse(error.message, 500));
  }
};

const deletePlace = async (req, res, next) => {
  const { placeId } = req.params;

  try {
    const placeToDelete = await Place.findById(placeId);

    if (!placeToDelete) {
      return next(errorResponse("No place found with this id", 404));
    }

    const userId = placeToDelete.creator;

    const user = await User.findById(userId);

    if (!user) {
      return next(errorResponse("No user found with this id", 404));
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();

    // Delete the place by ID
    await Place.findByIdAndDelete(placeId).session(sess);

    // Update the user's list of places
    await User.updateOne(
      { _id: userId },
      { $pull: { places: placeId } }
    ).session(sess);

    await sess.commitTransaction();

    res.json(successResponse("Place deleted successfully"));
  } catch (error) {
    return next(errorResponse(error.message, 500));
  }
};

module.exports = {
  getPlaces,
  createPlace,
  getSinglePlace,
  getPlaceByUserId,
  updatePlace,
  deletePlace,
};
