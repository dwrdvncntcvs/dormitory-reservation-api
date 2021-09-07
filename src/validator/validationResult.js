class ValidationResult {
  statusCode = null;
  message = null;
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports.ValidationResult = ValidationResult;
