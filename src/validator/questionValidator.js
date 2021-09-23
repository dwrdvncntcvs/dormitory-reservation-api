const { ValidationResult } = require("./validationResult");

exports.addQuestionValidator = (question, dormitoryData) => {
  if (question === "") {
    return new ValidationResult(401, "Invalid Input");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  return null;
};

exports.editQuestionValidator = (
  question,
  userData,
  questionData,
  dormitoryData
) => {
  if (question === "") {
    return new ValidationResult(401, "Invalid Input");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!questionData) {
    return new ValidationResult(404, "Question not found");
  }

  if (questionData.dormitoryId !== dormitoryData.id) {
    return new ValidationResult(404, "Question not found");
  }

  if (questionData.userId !== userData.id) {
    return new ValidationResult(404, "Question not found");
  }

  return null;
};

exports.removeQuestionValidator = (
  userData,
  questionData,
  dormitoryData,
) => {
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!questionData) {
    return new ValidationResult(404, "Question not found");
  }

  if (questionData.dormitoryId !== dormitoryData.id) {
    return new ValidationResult(404, "Question not found")
  }

  if (questionData.userId !== userData.id) {
    return new ValidationResult(404, "Question not found")
  }

  return null;
};
