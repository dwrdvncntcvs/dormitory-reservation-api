const express = require("express");

const requireAuth = require("../middlewares/requireAuth");

const amenityController = require("../controller/amenityController");

const route = express.Router();

route.post("/add-new-amenity", requireAuth, amenityController.addAmenities);

route.delete(
  "/delete-amenity/dorm-:dormId/amenity-:amenityId",
  requireAuth,
  amenityController.removeAmenities
);

module.exports = route;
