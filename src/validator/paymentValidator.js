const { ValidationResult } = require("../validator/validationResult");

exports.createPaymentValidator = (
  validRole,
  userData,
  dormitoryData,
  { sender, recipientNumber, amount, referenceNumber }
) => {
  if (
    sender === "" ||
    recipientNumber === "" ||
    amount === "" ||
    referenceNumber === ""
  ) {
    return new ValidationResult(403, "Invalid Input");
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

  return null;
};
