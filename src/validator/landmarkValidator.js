const { ValidationResult } = require("../validator/validationResult");

exports.addLandmarkValidator = (
  landmark,
  point,
  validRole,
  dormitoryData,
  userData
) => {
  if (landmark === "" || point === "") {
    return new ValidationResult(403, "Invalid Input");
  }

  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!userData) {
    return new ValidationResult(404, "User not found");
  }

  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(
      403,
      "User has no permission to add landmark to dormitory."
    );
  }

  if (dormitoryData.isVerified === false) {
    return new ValidationResult(401, "Dormitory is not verified");
  }

  return null;
};

exports.deleteLandmarkValidator = (validRole, dormitoryData, landmarkData) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!landmarkData) {
    return new ValidationResult(404, "Landmark not found");
  }

  if (dormitoryData.id !== landmarkData.dormitoryId) {
    return new ValidationResult(404, "Landmark not found");
  }

  return null;
};
