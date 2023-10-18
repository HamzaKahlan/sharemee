// passport-config.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../Models/userModel");
// const ExtractJwt = require("passport-jwt").ExtractJwt;

const { secretKey } = require("./config");

// Local Strategy for login
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// JWT Strategy for authentication
passport.use(
  new JwtStrategy(
    {
      secretOrKey: secretKey,
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies.jwt;
        }
        return token;
      },
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.sub).select("-password");
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
