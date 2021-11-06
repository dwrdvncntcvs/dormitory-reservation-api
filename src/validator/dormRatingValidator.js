const { ValidationResult } = require("./validationResult");

exports.addRatingValidator = (
  { rating },
  dormitoryData,
  validRole,
  isActive
) => {
  if (rating === "") {
    return new ValidationResult(401, "Invalid Input");
  }

  if (validRole === false) {
    return new ValidationResult((401, "Invalid User"));
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!isActive) {
    return new ValidationResult(404, "Reservation not active");
  }

  return null;
};

exports.removeRatingValidator = (
  userData,
  dormitoryData,
  ratingData,
  validRole
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!ratingData) {
    return new ValidationResult(404, "Rating not found");
  }

  if (ratingData.dormitoryId !== dormitoryData.id) {
    return new ValidationResult(404, "Rating not found");
  }

  if (ratingData.userId !== userData.id) {
    return new ValidationResult(404, "Rating not found");
  }

  return null;
};

exports.updateTotalRatingValidator = (dormitoryData, ratingAveData) => {
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!ratingAveData) {
    return new ValidationResult(404, "No Total Rating");
  }

  if (dormitoryData.id !== ratingAveData.dormitoryId) {
    return new ValidationResult(404, "No Total Rating");
  }

  return null;
};
