const { ValidationResult } = require("./validationResult");

exports.createNewRoomValidator = (
  { roomName, roomCapacity, activeTenant, roomCost, electricBill, waterBill },
  userData,
  dormitoryData,
  validRole
) => {
  //Check Role
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (
    roomName === "" ||
    activeTenant === "" ||
    roomCapacity === "" ||
    roomCost === "" ||
    electricBill === "" ||
    waterBill === ""
  ) {
    return new ValidationResult(404, "Invalid Inputs");
  }

  //Check if the dorm exists
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  //Check if right user
  if (userData.id !== dormitoryData.userId) {
    return new ValidationResult(404, "Dormitory not found");
  }

  //Check if dorm is verified
  if (dormitoryData.isVerified === false) {
    return new ValidationResult(401, "Dormitory is not verified");
  }

  return null;
};

exports.updateRoomPaymentValidator = (
  { roomCost, electricBill, waterBill },
  userData,
  roomData,
  dormitoryData,
  validRole
) => {
  //Checks if the role of the signed in user is owner
  if (validRole == false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (roomCost === "" || electricBill === "" || waterBill === "") {
    return new ValidationResult(403, "Invalid Inputs");
  }

  // Checks if the dormitory does exist in the database
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  //Checks if the room does exist in the database
  if (!roomData) {
    return new ValidationResult(404, "Room not found");
  }

  // Checks if the dormitory is owned by the signed in user
  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  //Checks if the room belongs to the dormitory
  if (dormitoryData.id !== roomData.dormitoryId) {
    return new ValidationResult(404, "Room not found");
  }

  return null;
};

exports.deleteRoomValidator = (
  validRole,
  userData,
  dormitoryData,
  roomData
) => {
  if (validRole == false) {
    return new ValidationResult(401, "Invalid User");
  }

  // Checks if the dormitory does exist in the database
  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  //Checks if the room does exist in the database
  if (!roomData) {
    return new ValidationResult(404, "Room not found");
  }

  // Checks if the dormitory is owned by the signed in user
  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  //Checks if the room belongs to the dormitory
  if (dormitoryData.id !== roomData.dormitoryId) {
    return new ValidationResult(404, "Room not found");
  }

  return null;
};
