const express = require("express");

//Authentication Middleware
const requireAuth = require("../middlewares/requireAuth");

//Controller
const roomController = require("../controller/roomController");

const route = express.Router();

//Endpoints
//To create new room including payments such as room cost, electric bill, and water bill
route.post("/create-new-room", requireAuth, roomController.createNewRoom);

//To update the payments bill of a room
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

module.exports = route;
