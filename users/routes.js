const router = require("express").Router();
const { check } = require("express-validator");
const {
  getAllUsers,
  getSingleUser,
  registerUser,
  loginUser,
  logoutUser,
  authUser,
} = require("./controllers");
const {
  isAuthenticated,
  isAuthorized,
} = require("../middlewares/authMiddleware");

//GET ALL USERS
router.get("/", getAllUsers);

//AUTH USERS
router.get("/auth", isAuthenticated, authUser);

//GET SINGLE USER
router.get("/:userId", getSingleUser);

//REGISTER NEW USER
router.post(
  "/register",
  [
    check("username").trim().notEmpty().withMessage("username is required"),
    check("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email format"),
    check("password").trim().notEmpty().withMessage("password is required"),
  ],
  registerUser
);

//LOGIN USER
router.post(
  "/login",
  [
    check("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email format"),
    check("password").notEmpty().withMessage("password is required"),
  ],
  loginUser
);

//LOGOUT USER
router.post("/logout", isAuthenticated, logoutUser);

module.exports = router;
