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

exports.dormitorySwitchValidator = (userData, dormitoryData, validRole) => {
  //Check the role of the userData
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  //Check if the dormitory does exist in the database
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
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
