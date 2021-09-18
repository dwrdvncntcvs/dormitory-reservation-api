const { ValidationResult } = require("./validationResult");
const fs = require("fs");

exports.addDormImagevalidator = (
  dormitoryData,
  name,
  userData,
  validRole,
  filePath
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (name === "") {
    return new ValidationResult(403, "Invalid Input");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  //Check if the dormitory was owned by the owner user
  if (userData.id !== dormitoryData.userId) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.isVerified === false) {
    return new ValidationResult(401, "Dormitory is not verified");
  }

  return null;
};

exports.deleteDormImageValidator = (
  dormitoryData,
  dormImageData,
  userData,
  validRole
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!dormImageData) {
    return new ValidationResult(404, "Dormitory Image not found");
  }

  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.id !== dormImageData.dormitoryId) {
    return new ValidationResult(404, "Dormitory Image not found");
  }

  return null;
};

exports.addDormitoryProfileImageValidator = (
  validRole,
  dormitoryData,
  userData,
  filePath
) => {
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
    fs.unlinkSync(filePath, (err) => {
      console.log(err);
    });
    return new ValidationResult(401, "Dormitory is not verified");
  }

  return null;
};

exports.removeDormitoryProfileImageValidator = (
  userData,
  validRole,
  dormitoryData,
  dormProfileImageData
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!dormProfileImageData) {
    return new ValidationResult(404, "Dormitory Image not found");
  }

  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.id !== dormProfileImageData.dormitoryId) {
    return new ValidationResult(404, "Dormitory Image not found");
  }

  return null;
};

exports.addDormitoryDocuments = (
  name,
  type,
  userData,
  dormitoryData,
  validRole
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (name === "" || type === "") {
    return new ValidationResult(404, "Dormitory not found");
  }

  //Check if dormitory does exist
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  //Check if the dormitory exists owned by the right owner
  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  return null;
};
