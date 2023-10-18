const router = require("express").Router();
const {
  isAuthenticated,
  isAuthorized,
} = require("../middlewares/authMiddleware");
const {
  getPlaces,
  getSinglePlace,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("./controllers");

//GET ALL PLACES

router.get("/", getPlaces);

//CREATE  PLACE

router.post("/", isAuthenticated, isAuthorized, createPlace);

//GET PLACES BY USER ID

router.get("/userplaces", isAuthenticated, getPlaceByUserId);

//GET SINGLEPLACE

router.get("/:placeId", isAuthenticated, getSinglePlace);

//UPDATE PLACE

router.patch("/:placeId", isAuthenticated, isAuthorized, updatePlace);

//DELETE PLACE

router.delete("/:placeId", isAuthenticated, deletePlace);

module.exports = router;
