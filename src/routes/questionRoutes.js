const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const questionController = require("../controller/questionController");

const route = express.Router();

route.post("/create-question", requireAuth, questionController.addQuestion);

module.exports = route;
