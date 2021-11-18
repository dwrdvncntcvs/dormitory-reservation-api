const express = require("express");

const requireAuth = require("../middlewares/requireAuth");

const reservationController = require("../controller/reservationController");

const route = express.Router();

route.post(
  "/create-new-reservation",
  requireAuth,
  reservationController.createNewReservation
);

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

route.get(
  "/filter-reservation/dormitory-:dormitoryId",
  requireAuth,
  reservationController.filterReservation
);

route.get(
  "/filter-reservation-by-userId",
  requireAuth,
  reservationController.filterReservationByUserId
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
  "/remove-tenant-user/dormitory-:dormId/room-:roomId/reservation-:reservationId",
  requireAuth,
  reservationController.removeUser
);

route.post(
  "/reject-user-reservation/dormitory-:dormitoryId/room-:roomId/reservation-:reservationId",
  requireAuth,
  reservationController.rejectUserReservation
);

module.exports = route;
