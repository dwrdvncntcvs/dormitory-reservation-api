const { ValidationResult } = require("./validationResult");

exports.createNewDormitoryValidator = (
  { name, address, contactNumber, allowedGender },
  userData,
  validRole
) => {
  //Check the user role
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }
  //Check if the user is verified
  if (userData.isVerified !== true) {
    return new ValidationResult(401, "Account is not verified");
  }
  //Check the field if not empty
  if (
    name === "" ||
    address === "" ||
    contactNumber === "" ||
    allowedGender === ""
  ) {
    return new ValidationResult(403, "Invalid Input");
  }
  return null;
};

exports.deleteDormitoryValidator = (userData, dormitoryData, validRole) => {
  //Check the role of the user
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }
  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }
  return null;
};

exports.dormitorySwitchValidator = (
  userData,
  dormitoryData,
  validRole,
  dormitoryAmenitySegment,
  dormitoryDocumentSegment,
  dormitoryLocationSegment,
  dormitoryLandmarkSegment,
  dormitoryRoomSegment
) => {
  //Check the role of the userData
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  //Check if the dormitory does exist in the database
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.isPayed !== true) {
    return new ValidationResult(404, "Missing Payment");
  }

  if (
    dormitoryAmenitySegment.length === 0 &&
    dormitoryRoomSegment.length === 0 &&
    dormitoryDocumentSegment.length === 0 &&
    dormitoryLocationSegment.length === 0 &&
    dormitoryLandmarkSegment.length === 0
  ) {
    return new ValidationResult(
      404,
      "Please complete all of your dormitory information"
    );
  }

  if (dormitoryAmenitySegment.length === 0) {
    return new ValidationResult(404, "Please add amenity for your dormitory");
  }

  if (dormitoryDocumentSegment.length === 0) {
    return new ValidationResult(
      404,
      "Please add a dormtory document for your dormitory"
    );
  }

  if (dormitoryLocationSegment.length === 0) {
    return new ValidationResult(404, "Please add your dormitory location");
  }

  if (dormitoryLandmarkSegment.length === 0) {
    return new ValidationResult(
      404,
      "Please add a landmark near to your dormitory"
    );
  }

  if (dormitoryRoomSegment.length === 0) {
    return new ValidationResult(404, "Please add a room for your dormitory");
  }

  //Check if the dormitory is owned by the user
  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.isVerified === false) {
    return new ValidationResult(404, "Dormitory not found");
  }

  return null;
};
