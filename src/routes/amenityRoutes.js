const express = require("express");

//Middleware authentication
const requireAuth = require("../middlewares/requireAuth");

//Controller Functions
const amenityController = require("../controller/amenityController");

const route = express.Router();

//To add new amenity
route.post("/add-new-amenity", requireAuth, amenityController.addAmenities);

route.delete("/delete-amenity/dorm-:dormId/amenity-:amenityId", requireAuth, amenityController.removeAmenities);

module.exports = route;
