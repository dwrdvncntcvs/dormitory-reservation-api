const { ValidationResult } = require("./validationResult");

exports.createNewReservationValidator = (
  slot,
  userData,
  dormitoryData,
  roomData,
  validRole
) => {
  if (slot === "") {
    return new ValidationResult(403, "Invalid Input");
  }

  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (userData.isVerified === false) {
    return new ValidationResult(401, "Account not verified");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.isVerified === false) {
    return new ValidationResult(401, "Dormitory is not available");
  }

  if (dormitoryData.isAccepting !== true) {
    return new ValidationResult(401, "Dormitory is not accepting right now");
  }

  if (dormitoryData.allowedGender !== "both") {
    if (dormitoryData.allowedGender !== userData.gender) {
      return new ValidationResult(
        401,
        `Dormitory only accepting ${dormitoryData.allowedGender} tenants`
      );
    }
  }

  if (!roomData) {
    return new ValidationResult(404, "Room not found");
  }

  if (roomData.dormitoryId !== dormitoryData.id) {
    return new ValidationResult(404, "Room not found");
  }

  if (slot > roomData.roomCapacity) {
    return new ValidationResult(
      403,
      "Your wanted slot doesn't fit on the available space in the room"
    );
  }

  return null;
};

exports.cancelReservationValidator = (
  userData,
  dormitoryData,
  roomData,
  reservationData,
  validRole
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!roomData) {
    return new ValidationResult(404, "Room not found");
  }

  if (!reservationData) {
    return new ValidationResult(404, "Reservation not found");
  }

  if (reservationData.roomId !== roomData.id) {
    return new ValidationResult(404, "You can't cancel the reservation");
  }

  if (reservationData.dormitoryId !== dormitoryData.id) {
    return new ValidationResult(404, "You can't cancel the reservation");
  }

  if (reservationData.userId !== userData.id) {
    return new ValidationResult(404, "You can't cancel the reservation");
  }

  return null;
};

exports.viewAllReservationsValidator = (userData, dormitoryData, validRole) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult((404, "Dormitory not found"));
  }

  if (userData.id !== dormitoryData.userId) {
    return new ValidationResult(404, "Dormitory not found");
  }

  return null;
};

exports.removeUserValidator = (
  dormitoryData,
  roomData,
  reservationData,
  validRole
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!roomData) {
    return new ValidationResult(404, "Room not found");
  }

  if (!reservationData) {
    return new ValidationResult(404, "Reservation not found");
  }

  if (dormitoryData.id !== roomData.dormitoryId) {
    return new ValidationResult(404, "Room not found");
  }

  if (
    reservationData.roomId !== roomData.id &&
    reservationData.dormitoryId !== dormitoryData.id
  ) {
    return new ValidationResult((404, "Reservation not found"));
  }

  return null;
};

exports.addUserValidator = (
  userData,
  dormitoryData,
  roomData,
  reservationData,
  validRole
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!roomData) {
    return new ValidationResult(404, "Room not found");
  }

  if (!reservationData) {
    return new ValidationResult(404, "Reservation not found");
  }

  if (userData.id !== dormitoryData.userId) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.id !== roomData.dormitoryId) {
    return new ValidationResult(404, "Room not found");
  }

  if (roomData.id !== reservationData.roomId) {
    return new ValidationResult(404, "Reservation not found");
  }

  if (roomData.activeTenant >= roomData.capacity) {
    return new ValidationResult(401, "Room is full");
  }

  if (roomData.capacity < reservationData.roomSlot) {
    return new ValidationResult(403, "Room Slots doesn't fit to the room");
  }

  if (reservationData.isAccepted === false) {
    return new ValidationResult(401, "Your are not yet accepted");
  }

  if (reservationData.isAdded === true) {
    return new ValidationResult(403, "User already added");
  }

  return null;
};

exports.acceptReservationsValidator = (
  userData,
  dormitoryData,
  roomData,
  reservationData,
  validRole
) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!roomData) {
    return new ValidationResult(404, "Room not found");
  }

  if (!reservationData) {
    return new ValidationResult(404, "Reservation not found");
  }

  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.id !== roomData.dormitoryId) {
    return new ValidationResult(404, "Room not found");
  }

  if (reservationData.roomId !== roomData.id) {
    return new ValidationResult(404, "Reservation not found");
  }

  if (roomData.capacity < reservationData.roomSlot) {
    return new ValidationResult(403, "Room Slots doesn't fit to the room");
  }

  return null;
};

exports.getReservationDetailValidator = (
  userData,
  dormitoryData,
  roomData,
  reservationData,
  validRole
) => {
  console.log("User Id: ", userData.id);
  console.log("Dormitory User Id: ", dormitoryData.userId);
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  if (!dormitoryData) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (!roomData) {
    return new ValidationResult(404, "Room not found");
  }

  if (!reservationData) {
    return new ValidationResult(404, "Reservation not found");
  }

  if (dormitoryData.userId !== userData.id) {
    return new ValidationResult(404, "Dormitory not found");
  }

  if (dormitoryData.id !== roomData.dormitoryId) {
    return new ValidationResult(404, "Room not found");
  }

  if (reservationData.roomId !== roomData.id) {
    return new ValidationResult(404, "Reservation not found");
  }

  return null;
};

exports.filterReservationValidator = (userData, dormitoryData, validRole) => {
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

exports.filterReservationByUserIdValidator = (validRole) => {
  if (validRole === false) {
    return new ValidationResult(401, "Invalid User");
  }

  return null;
};
