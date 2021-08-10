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

//To view all new reservations by the tenant users
route.get(
  "/view-all-new-reservations/dorm-:dormId-room-:roomId",
  requireAuth,
  reservationController.viewAllRoomReservations
);

route.put(
  "/accept-new-reservation",
  requireAuth,
  reservationController.acceptReservations
);

module.exports = route;
