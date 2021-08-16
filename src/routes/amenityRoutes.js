const express = require("express");

//Middleware authentication
const requireAuth = require("../middlewares/requireAuth");

//Controller Functions
const amenityController = require("../controller/amenityController");

const route = express.Router();

//To add new amenity
route.post("/add-new-amenity", requireAuth, amenityController.addAmenities);

module.exports = route;
