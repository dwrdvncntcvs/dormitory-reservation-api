const express = require("express");
const multer = require("multer");
const path = require("path");

const requireAuth = require("../middlewares/requireAuth");

const paymentController = require("../controller/paymentController");

const route = express.Router();


module.exports = route;