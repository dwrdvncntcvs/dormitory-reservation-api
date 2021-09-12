const { ValidationResult } = require('./validationResult.js');

exports.validateAmenity = (amenity, validRole, dormitoryData, userData) => {
  if (amenity === null || amenity === "") {
    return new ValidationResult(400, "Invalid Input");
  }
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User" );
  }
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found" );
  }
  if (!userData) {
    return new ValidationResult(404, "User not found" );
  }
  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(403, "User has no permission to add amenity to dormitory." );
  }
  return null;
}
