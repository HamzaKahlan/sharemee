const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const PlacesRoutes = require("./places/routes");
const UserRoutes = require("./users/routes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const CustomErrorMiddleware = require("./middlewares/errorHandler");
const cors = require("cors");
require("dotenv").config();
require("./config/passport-config");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));

app.use(cookieParser());

app.use(
  cors({
    origin: "https://652fb2ed9aea69058f805488--sharemine.netlify.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(passport.initialize());

//ALL ROUTES MIDDLEWARE
app.use("/api/places", PlacesRoutes);
app.use("/api/users", UserRoutes);

app.use(CustomErrorMiddleware);

mongoose
  .connect(process.env.MONGO_URI)
  .then(app.listen(PORT,()=>{
    console.log("server runs on port " + PORT)
  }))
  .catch((error) => {
    console.log(error);
  });
