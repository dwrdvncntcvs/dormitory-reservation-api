const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const questionController = require("../controller/questionController");

const route = express.Router();

route.post("/create-question", requireAuth, questionController.addQuestion);

route.put("/edit-question", requireAuth, questionController.editQuestion);

route.delete(
  "/remove-question/question-:questionId/dormitory-:dormitoryId",
  requireAuth,
  questionController.removeQuestion
);

module.exports = route;
