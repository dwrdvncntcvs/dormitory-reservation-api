const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

//Functions
const commentController = require("../controller/commentController");

const route = express.Router();

route.post("/add-comment", requireAuth, commentController.addComment);

route.put("/edit-comment", requireAuth, commentController.editComment);

module.exports = route;
