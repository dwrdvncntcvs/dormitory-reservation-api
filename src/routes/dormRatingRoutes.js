const express = require("express");

//Authentication Middleware
const requireAuth = require("../middlewares/requireAuth");

//Controller or Functions
const dormRatingController = require("../controller/dormRatingController");

const route = express.Router();

route.post("/add-rating", requireAuth, dormRatingController.addRating);

route.delete("/remove-rating", requireAuth, dormRatingController.removeRating);

route.put("/update-rating-average", dormRatingController.updateTotalRating);

route.get(
  "/get-dormitory-by-rating",
  dormRatingController.filterDormitoryByRating
);

module.exports = route;
