const express = require("express");

const requireAuth = require("../middlewares/requireAuth");

const roomController = require("../controller/roomController");

const route = express.Router();

route.post("/create-new-room", requireAuth, roomController.createNewRoom);

route.put(
  "/update-room-payment",
  requireAuth,
  roomController.updateRoomPayment
);

route.delete(
  "/delete-room/dormitory-:dormitoryId/room-:roomId",
  requireAuth,
  roomController.deleteRoom
);

route.get(
  "/get-room-detail/dormitory-:dormitoryId/room-:roomId",
  requireAuth,
  roomController.getRoomDetail
);

module.exports = route;
