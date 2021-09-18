const { ValidationResult } = require("./validationResult.js");

exports.validateAmenity = (amenity, validRole, dormitoryData, userData) => {
  if (amenity === null || amenity === "") {
    return new ValidationResult(400, "Invalid Input");
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
      "User has no permission to add amenity to dormitory."
    );
  }

  if (dormitoryData.isVerified === false) {
    return new ValidationResult(401, "Dormitory is not verified");
  }
  return null;
};

exports.removeAmenityValidator = (
  validRole,
  amenityData,
  dormitoryData,
  userData
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!amenityData) {
    return new ValidationResult(404, "Amenity not found");
  }

  if (!userData) {
    return new ValidationResult(404, "User not found");
  }

  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(
      403,
      "User has no permission to delete amenity to dormitory."
    );
  }

  if (dormitoryData.isVerified === false) {
    return new ValidationResult(401, "Dormitory is not verified");
  }

  if (amenityData.dormitoryId !== dormitoryData.id) {
    return new ValidationResult(404, "Amenity not found");
  }

  return null;
};
