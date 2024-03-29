const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const commentController = require("../controller/commentController");

const route = express.Router();

route.post("/add-comment", requireAuth, commentController.addComment);

route.put("/edit-comment", requireAuth, commentController.editComment);

route.delete(
  "/remove-comment/dormitory-:dormitoryId/question-:questionId/comment-:commentId",
  requireAuth,
  commentController.removeComment
);

module.exports = route;
