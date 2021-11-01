const { ValidationResult } = require('./validationResult.js');

exports.validateNewComment = (comment, userData, dormitoryData, questionData) => {
  if (comment === "") {
    return new ValidationResult(401, "Invalid Input" );
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dorm not found" );
  }

  if (!questionData) {
    return new ValidationResult(404, "Question not found" );
  }

  if (!userData) {
    return new ValidationResult(404, "User not found" );
  }

  if (questionData.dormitoryId !== dormitoryData.id) {
    return new ValidationResult(404, "Question not found" );
  }

  return null;
}

exports.validateExistingComment = (userData, dormitoryData, questionData, commentData) => {
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found" );
  }

  if (!questionData) {
    return new ValidationResult(404, "Question not found" );
  }

  if (!commentData) {
    return new ValidationResult(404, "Comment not found" );
  }

  if (commentData.dormitoryId !== dormitoryData.id) {
    return new ValidationResult(404, "Comment not found" );
  }

  if (commentData.questionId !== questionData.id) {
    return new ValidationResult(404, "Comment not found" );
  }

  if (commentData.userId !== userData.id) {
    return new ValidationResult(404, "Comment not found" );
  }

  return null;
}

