exports.createNewReservationValidator = (
  userData,
  dormitoryData,
  roomData,
  validRole,
  t,
  res
) => {
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  if (userData.isVerified === false) {
    t.rollback();
    return res.status(401).send({ msg: "Account not verified" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (dormitoryData.isVerified === false) {
    t.rollback();
    return res.status(401).send({ msg: "Dormitory is not available" });
  }

  if (dormitoryData.isAccepting !== true) {
    t.rollback();
    return res
      .status(401)
      .send({ msg: "Dormitory is not accepting right now" });
  }

  if (dormitoryData.allowedGender !== "both") {
    if (dormitoryData.allowedGender !== userData.gender) {
      t.rollback();
      return res.status(401).send({
        msg: `Dormitory only accepting ${dormitoryData.allowedGender} tenants`,
      });
    }
  }

  if (!roomData) {
    t.rollback();
    return res.status(404).send({ msg: "Room not found" });
  }

  if (roomData.dormitoryId !== dormitoryData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Room not found" });
  }
};

exports.cancelReservationValidator = (
  userData,
  dormitoryData,
  roomData,
  reservationData,
  validRole,
  t,
  res
) => {
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (!roomData) {
    t.rollback();
    return res.status(404).send({ msg: "Room not found" });
  }

  if (!reservationData) {
    t.rollback();
    return res.status(404).send({ msg: "Reservation not found" });
  }

  if (reservationData.roomId !== roomData.id) {
    t.rollback();
    return res.status(401).send({ msg: "You can't cancel reservation 1" });
  }

  if (reservationData.dormitoryId !== dormitoryData.id) {
    t.rollback();
    return res.status(401).send({ msg: "You can't cancel reservation 2" });
  }

  if (reservationData.userId !== userData.id) {
    t.rollback();
    return res.status(401).send({ msg: "You can't cancel reservation 3" });
  }
};

exports.viewAllReservationsValidator = (
  userData,
  dormitoryData,
  validRole,
  res
) => {
  if (validRole === false) return res.status(401).send({ msg: "Invalid User" });

  if (!dormitoryData)
    return res.status(404).send({ msg: "Dormitory not found" });

  if (userData.id !== dormitoryData.userId)
    return res.status(404).send({ msg: "Dormitory not found" });
};

exports.removeUserValidator = (
  dormitoryData,
  roomData,
  reservationData,
  validRole,
  t,
  res
) => {
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (!roomData) {
    t.rollback();
    return res.status(404).send({ msg: "Room not found" });
  }

  if (!reservationData) {
    t.rollback();
    return res.status(404).send({ msg: "Reservation not found" });
  }

  if (dormitoryData.id !== roomData.dormitoryId) {
    t.rollback();
    return res.status(404).send({ msg: "Room not found" });
  }

  if (
    reservationData.roomId !== roomData.id &&
    reservationData.dormitoryId !== dormitoryData.id
  ) {
    t.rollback();
    return res.status(404).send({ msg: "Reservation not found" });
  }
};

exports.addUserValidator = (
  userData,
  dormitoryData,
  roomData,
  reservationData,
  validRole,
  t,
  res
) => {
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ message: "Invalid User" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (!roomData) {
    t.rollback();
    return res.status(404).send({ msg: "Room not found" });
  }

  if (!reservationData) {
    t.rollback();
    return res.status(404).send({ msg: "Reservation not found" });
  }

  if (userData.id !== dormitoryData.userId) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (dormitoryData.id !== roomData.dormitoryId) {
    t.rollback();
    return res.status(404).send({ msg: "Room not found" });
  }

  if (roomData.id !== reservationData.roomId) {
    t.rollback();
    return res.status(404).send({ msg: "Reservation not found" });
  }

  if (roomData.activeTenant >= roomData.capacity) {
    t.rollback();
    return res.status(401).send({ msg: "Room is full" });
  }

  if (reservationData.isAccepted === false) {
    t.rollback();
    return res.status(401).send({ msg: "You are not yet accepted" });
  }

  if (reservationData.isAdded === true) {
    t.rollback();
    return res.send({ msg: "User Already added" });
  }
};

exports.acceptReservationsValidator = (
  userData,
  dormitoryData,
  roomData,
  reservationData,
  validRole,
  t,
  res
) => {
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ message: "Invalid User" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ message: "Dormitory not found." });
  }

  if (!roomData) {
    t.rollback();
    return res.status(404).send({ message: "Room not found." });
  }

  if (!reservationData) {
    t.rollback();
    return res.status(404).send({ message: "Reservation not found." });
  }

  if (dormitoryData.userId !== userData.id) {
    t.rollback();
    return res.status(404).send({ message: "Dormitory not found" });
  }

  if (dormitoryData.id !== roomData.dormitoryId) {
    t.rollback();
    return res.status(404).send({ message: "Room not found" });
  }

  if (reservationData.roomId !== roomData.id) {
    t.rollback();
    return res.status(404).send({ message: "Reservation not found" });
  }
};
