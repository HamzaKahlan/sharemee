const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secretKey } = require("../config/config");
const User = require("../Models/userModel");
const { successResponse, errorResponse } = require("../responses/response");
const { validationResult } = require("express-validator");

//GET ALL USERS
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("username places image ");
    if (users.length === 0) {
      return next(errorResponse("No users found", 404));
    }
    res.json(successResponse("Operation successful", users));
  } catch (error) {
    return next(errorResponse(error.message, 500));
  }
};

//GET SINGLE USERS
const getSingleUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select("username");
    if (!user) {
      return next(errorResponse("No user found with this id", 404));
    }
    res.json(successResponse("Operation successful", user));
  } catch (error) {
    return next(errorResponse(error.message, 500));
  }
};

//REGISTER NEW USER
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      errorResponse("Invalid user inputs : all fields required", 400)
    );
  }
  const { username, email, password, image } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(errorResponse("Email already exists.", 400));
  }
  try {
    // Hash and salt the password
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      image,
      places: [],
    });
    const savedUser = await newUser.save();
    res.status(202).json(successResponse("User registred successfully"));
  } catch (error) {
    return next(errorResponse(error.message, 500));
  }
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errorResponse("Invalid user inputs format", 400));
  }

  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return next(errorResponse("Unauthorized: Invalid credentials", 401));
    }

    // User is authenticated, generate a new JWT token
    const token = jwt.sign({ sub: user._id }, secretKey, {
      expiresIn: "30d", // Set the token expiration as needed
    });

    // Set the JWT token in an HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 1000,
    });

    // Include user data in the response
    res.json(
      successResponse("User logged in successfully", {
        currentUser: {
          id: user._id,
          username: user.username,
          places: user.places,
        },
      })
    );
  })(req, res, next);
};

//LOGOUT USER
const logoutUser = (req, res, next) => {
  try {
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    res.json(successResponse("Logged out successfully", { currentUser: null }));
  } catch (error) {
    return next(errorResponse(error.message, 500));
  }
};

const authUser = (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      console.log("no user", user);
      return res
        .status(401)
        .json({ isAuthenticated: false, currentUser: null });
    }
    res.json({
      isAuthenticated: true,
      currentUser: {
        id: user._id,
        username: user.username,
        places: user.places,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ isAuthenticated: false, currentUser: null });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  registerUser,
  loginUser,
  logoutUser,
  authUser,
};
