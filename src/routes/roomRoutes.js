const express = require('express');

//Authentication Middleware
const requireAuth = require('../middlewares/requireAuth');

//Controller
const roomController = require('../controller/roomController');

const route = express.Router();

//Endpoints
route.post('/create-new-room', requireAuth, roomController.createNewRoom);

route.post('/add-room-payment', requireAuth, roomController.addRoomPayment);

module.exports = route;