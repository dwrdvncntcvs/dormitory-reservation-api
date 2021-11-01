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
  "/view-all-reservations/dorm-:dormId",
  requireAuth,
  reservationController.viewAllReservations
);

route.get(
  "/view-reservation-detail/dormitory-:dormitoryId/room-:roomId/reservation-:reservationId",
  requireAuth,
  reservationController.getReservationDetail
);

route.put(
  "/accept-new-reservation",
  requireAuth,
  reservationController.acceptReservations
);

route.delete(
  "/cancel-reservation/dormitory-:dormitoryId/room-:roomId/reservation-:reservationId",
  requireAuth,
  reservationController.cancelReservation
);

route.put(
  "/add-tenant-reservation",
  requireAuth,
  reservationController.addUser
);

route.delete(
  "/remove-tenant-user",
  requireAuth,
  reservationController.removeUser
);

module.exports = route;
