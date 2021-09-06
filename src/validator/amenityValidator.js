const { ValidationResult } = require('./validationResult.js');

exports.addAmenityValidator = (
  amenity,
  validRole,
  dormitoryData,
  userData,
  res,
  t
) => {
  if (amenity === "") {
    t.rollback();
    return res.status(404).send({ msg: "Invalid Input" });
  }

  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (dormitoryData.userId !== userData.id) {
    t.rollback();
    return res.status(401).send({ msg: "Dormitory not found" });
  }
};

exports.validateAmenity = (amenity, validRole, dormitoryData, userData) => {
  if (amenity === "") {
    return new ValidationResult(400, "Invalid Input");
  }
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User" );
  }
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found" );
  }
  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(403, "User has no permission to add amenity to dormitory." );
  }
  return null;
}
