const express = require("express");

//Require Authentication Middleware
const requireAuth = require("../middlewares/requireAuth");

//Require Reservation Controller (Functions)
const reservationController = require("../controller/reservationController");

const route = express.Router();

//Request Methods

//To create new reservation
route.post(
  "/create-new-reservation",
  requireAuth,
  reservationController.createNewReservation
);

module.exports = route;
