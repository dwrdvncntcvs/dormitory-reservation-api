class ValidationResult {
  
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports.ValidationResult = ValidationResult;
