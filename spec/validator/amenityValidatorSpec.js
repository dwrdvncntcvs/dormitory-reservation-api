const { validateAmenity } = require("../../src/validator/amenityValidator");

describe('amenityValidator', () => {

  it('should return ValidationResult when amenity is empty', () => {
    const amenity = '';
    const validRole = true;
    const dormitoryData = {};
    const userData = {};

    const actual = validateAmenity(amenity, validRole, dormitoryData, userData);

    expect(actual.statusCode).toBe(400);
    expect(actual.message).toBe("Invalid Input");
  });

  it('should return ValidationResult when validRole is false', () => {
    const amenity = 'blah';
    const validRole = false;
    const dormitoryData = {};
    const userData = {};

    const actual = validateAmenity(amenity, validRole, dormitoryData, userData);

    expect(actual.statusCode).toBe(401);
    expect(actual.message).toBe("Invalid User");
  });

  it('should return ValidationResult when dormitoryData is null', () => {});

  it('should return ValidationResult when userData is null', () => {});

  it('should return ValidationResult when userId of dormitory and user does not match', () => {});

  it('should return null when data is valid', () => {});
});