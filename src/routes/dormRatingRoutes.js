const express = require("express");

//Authentication Middleware
const requireAuth = require("../middlewares/requireAuth");

//Controller or Functions
const dormRatingController = require("../controller/dormRatingController");

const route = express.Router();

route.post("/add-rating", requireAuth, dormRatingController.addRating);

module.exports = route;
