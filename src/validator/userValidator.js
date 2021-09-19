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

exports.userValidator = (user, res, t = null) => {
  if (t !== null) {
    if (!user) {
      t.rollback();
      res.send({ msg: "Invalid User" });
    }
  }

  if (!user) {
    res.send({ msg: "Invalid User" });
  }
};

exports.verifyDormitory = (validRole, dormitoryData) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  return null;
};
