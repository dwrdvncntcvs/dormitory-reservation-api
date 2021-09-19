const { ValidationResult } = require("./validationResult");

exports.signUpValidator = ({
  name,
  username,
  email,
  plainPassword,
  plainConfirmPassword,
  contactNumber,
  address,
  gender,
  role,
}) => {
  if (
    name === "" ||
    username === "" ||
    email === "" ||
    plainPassword === "" ||
    plainConfirmPassword === "" ||
    contactNumber === "" ||
    address === "" ||
    gender === "" ||
    role === ""
  ) {
    return new ValidationResult(401, "Invalid Imputs");
  }

  return null;
};

exports.passwordValidator = (password) => {
  if (password === false) {
    return new ValidationResult(401, "Passwords not matched");
  }

  return null;
};

exports.signInValidator = ({ username, plainPassword, role }, user) => {
  if (username === "" || plainPassword === "" || role === "") {
    return new ValidationResult(401, "Invalid Inputs");
  }

  if (!user) {
    return new ValidationResult(401, "Invalid Username and Password");
  }

  if (user.isEmailVerified !== true) {
    return new ValidationResult(
      401,
      "Please Check your email to verify your account"
    );
  }

  return null;
};

exports.editAccountValidator = (toBeEdit) => {
  if (toBeEdit === "") {
    return new ValidationResult(401, "Invalid Input");
  }

  return null;
};

exports.is_roleValid = (validRole) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  return null;
};

exports.verifyDormitory = (validRole, dormitoryData) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.isVerified === true) {
    return new ValidationResult(400, "Dormitory's already verified");
  }

  return null;
};

exports.userValidator = (validRole, userData) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!userData) {
    return new ValidationResult(404, "User not found");
  }

  if (userData.isVerified === true) {
    return new ValidationResult(400, "User's already verified");
  }

  return null;
};
