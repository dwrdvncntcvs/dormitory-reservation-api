const { ValidationResult } = require("../validator/validationResult");

exports.createPaymentValidator = (
  dormitoryPaymentData,
  notValidPayment,
  isExist,
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

  if (userData.isVerified !== true) {
    return new ValidationResult(401, "You are not verified");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryPaymentData.dormitoryId !== dormitoryData.id) {
    return new ValidationResult(404, "Payment not found");
  }

  if (isExist === true) {
    return new ValidationResult(403, "Can't use this reference number anymore");
  }

  if (notValidPayment > 0) {
    return new ValidationResult(
      403,
      "You will not be able to send payment until you have pending one"
    );
  }
  return null;
};

exports.paymentVerification = (
  validRole,
  dormitoryData,
  paymentData,
  userToBeMailed
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!paymentData) {
    return new ValidationResult(404, "Payment not found");
  }

  if (dormitoryData.userId !== userToBeMailed.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.id !== paymentData.dormitoryId) {
    return new ValidationResult(404, "Payment not found 1");
  }

  if (paymentData.userId !== userToBeMailed.id) {
    return new ValidationResult(404, "Payment not found 2");
  }

  return null;
};
