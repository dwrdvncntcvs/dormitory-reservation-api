const { validateAmenity } = require("../../src/validator/amenityValidator");

describe("amenityValidator", () => {
  it("should return ValidationResult when amenity is null", () => {
    const amenity = null;
    const validRole = true;
    const dormitoryData = {};
    const userData = {};

    const actual = validateAmenity(amenity, validRole, dormitoryData, userData);

    expect(actual.statusCode).toBe(400);
    expect(actual.message).toBe("Invalid Input");
  });

  it("should return ValidationResult when amenity is empty", () => {
    const amenity = "";
    const validRole = true;
    const dormitoryData = {};
    const userData = {};

    const actual = validateAmenity(amenity, validRole, dormitoryData, userData);

    expect(actual.statusCode).toBe(400);
    expect(actual.message).toBe("Invalid Input");
  });

  it("should return ValidationResult when validRole is false", () => {
    const amenity = "blah";
    const validRole = false;
    const dormitoryData = {};
    const userData = {};

    const actual = validateAmenity(amenity, validRole, dormitoryData, userData);

    expect(actual.statusCode).toBe(401);
    expect(actual.message).toBe("Invalid User");
  });

  it("should return ValidationResult when dormitoryData is null", () => {
    const amenity = "blah";
    const validRole = true;
    const dormitoryData = null;
    const userData = {};

    const actual = validateAmenity(amenity, validRole, dormitoryData, userData);

    expect(actual.statusCode).toBe(404);
    expect(actual.message).toBe("Dormitory not found");
  });

  it("should return ValidationResult when userData is null", () => {
    const amenity = "blah";
    const validRole = true;
    const dormitoryData = {};
    const userData = null;

    const actual = validateAmenity(amenity, validRole, dormitoryData, userData);

    expect(actual.statusCode).toBe(404);
    expect(actual.message).toBe("User not found");
  });

  it("should return ValidationResult when userId of dormitory and user does not match", () => {
    const amenity = "blah";
    const validRole = true;
    const dormitoryData = { userId: 1 };
    const userData = { id: 2 };

    const actual = validateAmenity(amenity, validRole, dormitoryData, userData);

    expect(actual.statusCode).toBe(403);
    expect(actual.message).toBe(
      "User has no permission to add amenity to dormitory."
    );
  });

  it("should return null when data is valid", () => {
    const amenity = "blah";
    const validRole = true;
    const dormitoryData = { userId: 1 };
    const userData = { id: 1 };

    const actual = validateAmenity(amenity, validRole, dormitoryData, userData);

    expect(actual).toBe(null);
  });
});
