const { ValidationResult } = require("../validator/validationResult");

exports.addLandmarkValidator = (
  landmark,
  validRole,
  dormitoryData,
  userData
) => {
  if (landmark === "") {
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
