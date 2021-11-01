const express = require("express");

const requireAuth = require("../middlewares/requireAuth");

const landmarkController = require("../controller/landmarkController");

const route = express.Router();

route.post("/add-landmark", requireAuth, landmarkController.addLandmark);

route.delete(
  "/delete-landmark/dormitory-:dormitoryId/landmark-:landmarkId",
  requireAuth,
  landmarkController.deleteLandmark
);

module.exports = route;
