const { ValidationResult } = require("./validationResult");

exports.dormLocationValidator = (
  { longitude, latitude },
  userData,
  dormitoryData,
  validRole
) => {
  if (longitude === "" || latitude === "") {
    return new ValidationResult(401, "Invalid Inputs");
  }

  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.isVerified === false) {
    return new ValidationResult(401, "Dormitory is not verified");
  }

  return null;
};
