const express = require('express');

//Authentication Middleware
const requireAuth = require('../middlewares/requireAuth');

//Require controller or function file
const dormLocationController = require("../controller/dormLocationController");

const route = express.Router();

route.post("/add-dormitory-location", requireAuth, dormLocationController.addDormitoryLocation);

module.exports = route;