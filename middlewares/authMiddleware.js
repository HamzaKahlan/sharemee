const passport = require("passport");

// Custom middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Store the authenticated user in the request object
    req.user = user;
    next();
  })(req, res, next);
};

// Custom middleware to check if the user has the necessary permissions

const isAuthorized = (req, res, next) => {
  if (req.user && req.user._id.equals(req.body.creator)) {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = {
  isAuthenticated,
  isAuthorized,
};
