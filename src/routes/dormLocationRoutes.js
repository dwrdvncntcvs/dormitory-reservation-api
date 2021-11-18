const express = require("express");

const requireAuth = require("../middlewares/requireAuth");

const dormLocationController = require("../controller/dormLocationController");

const route = express.Router();

route.post(
  "/add-dormitory-location",
  requireAuth,
  dormLocationController.addDormitoryLocation
);

route.get(
  "/get-dormitory-location/dormitory-:dormitoryId/location-:locationId",
  requireAuth,
  dormLocationController.getDormitoryLocation
);

route.delete(
  "/delete-dormitory-location/dormitory-:dormitoryId/location-:locationId",
  requireAuth,
  dormLocationController.removeDormitoryLocation
);

module.exports = route;
