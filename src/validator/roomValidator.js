exports.createNewRoomValidator = (
  { roomName, roomCapacity, roomCost, electricBill, waterBill },
  userData,
  dormitoryData,
  validRole,
  t,
  res
) => {
  //Check Role
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  if (
    roomName === "" ||
    roomCapacity === "" ||
    roomCost === "" ||
    electricBill === "" ||
    waterBill === ""
  ) {
    t.rollback();
    return res.status(404).send({ msg: "Invalid Inputs" });
  }

  //Check if the dorm exists
  if (!dormitoryData) {
    t.rollback();
    return res.status(401).send({ msg: "Dormitory not found" });
  }

  //Check if right user
  if (userData.id !== dormitoryData.userId) {
    t.rollback();
    return res.status(401).send({ msg: "Dormitory not found" });
  }

  //Check if dorm is verified
  if (dormitoryData.isVerified === false) {
    t.rollback();
    return res.status(401).send({ msg: "Dormitory is not verified" });
  }
};

exports.updateRoomPaymentValidator = (
  { roomCost, electricBill, waterBill },
  userData,
  roomData,
  dormitoryData,
  validRole,
  t,
  res
) => {
  //Checks if the role of the signed in user is owner
  if (validRole == false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  if (roomCost === "" || electricBill === "" || waterBill === "") {
    t.rollback();
    return res.status(404).send({ msg: "Invalid Input" });
  }

  // Checks if the dormitory does exist in the database
  if (!dormitoryData) {
    t.rollback();
    return res.status(401).send({ msg: "Dormitory not found" });
  }

  //Checks if the room does exist in the database
  if (!roomData) {
    t.rollback();
    return res.status(401).send({ msg: "Room not found" });
  }

  // Checks if the dormitory is owned by the signed in user
  if (dormitoryData.userId !== userData.id) {
    t.rollback();
    return res.status(401).send({ msg: "Dormitory not found" });
  }

  //Checks if the room belongs to the dormitory
  if (dormitoryData.id !== roomData.dormitoryId) {
    t.rollback();
    return res.status(401).send({ msg: "Room not found" });
  }
};
