const db = require("../../models");
const validator = require("../validator/validator");

//To Find Values in Database
const {
  findDormitoryData,
  findRoomData,
  findReservationData,
} = require("../database/find");

const {
  createNewReservationValidator,
  cancelReservationValidator,
  viewAllReservationsValidator,
  removeUserValidator,
  addUserValidator,
  acceptReservationsValidator,
  getReservationDetailValidator,
  filterReservationValidator,
  filterReservationByUserIdValidator,
} = require("../validator/reservationValidator");
const {
  createReservationMailer,
  cancelReservationMailer,
  addUserMailer,
  acceptReservationMailer,
  rejectTenantReservationMailer,
} = require("../mailer/reservationMailer");

const { Op } = require("sequelize");

//For Tenant Users
//To create new reservation for tenants
exports.createNewReservation = async (req, res) => {
  const { dormId, roomId, slot } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const roomData = await findRoomData(roomId);
  const validRole = validator.isValidRole(userData.role, "tenant");

  const validationResult = createNewReservationValidator(
    slot,
    userData,
    dormitoryData,
    roomData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    await db.Reservation.create(
      {
        dormitoryId: dormId,
        roomId,
        roomSlot: slot,
        roomName: roomData.name,
        userId: userData.id,
        name: userData.name,
        email: userData.email,
        address: userData.address,
        contactNumber: userData.contactNumber,
        isPending: true,
      },
      { transaction: t }
    );
    await t.commit();

    createReservationMailer(userData);

    return res.send({ msg: "Reservation Created." });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//To cancel tenant's current reservations
exports.cancelReservation = async (req, res) => {
  const reservationId = req.params.reservationId;
  const dormitoryId = req.params.dormitoryId;
  const roomId = req.params.roomId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const roomData = await findRoomData(roomId);
  const reservationData = await findReservationData(reservationId);
  const validRole = validator.isValidRole(userData.role, "tenant");

  const validationResult = cancelReservationValidator(
    userData,
    dormitoryData,
    roomData,
    reservationData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    await db.Reservation.destroy(
      { where: { id: reservationData.id } },
      { transaction: t }
    );

    await t.commit();

    cancelReservationMailer(userData);

    return res.send({ msg: "Reservation was successfully cancelled" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.send({ msg: "Something went wrong" });
  }
};

//For Owner users
//To see all the new reservation of tenant Users
exports.viewAllReservations = async (req, res) => {
  const dormId = req.params.dormId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = viewAllReservationsValidator(
    userData,
    dormitoryData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  try {
    const reservations = await db.Reservation.findAll({
      where: {
        dormitoryId: dormitoryData.id,
      },
      include: [db.Dormitory, db.Room, db.User],
    });

    return res.send({ reservations });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//To remove reservation of the user
exports.removeUser = async (req, res) => {
  const dormId = req.params.dormId;
  const roomId = req.params.roomId;
  const reservationId = req.params.reservationId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const roomData = await findRoomData(roomId);
  const reservationData = await findReservationData(reservationId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = removeUserValidator(
    dormitoryData,
    roomData,
    reservationData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    await db.Reservation.destroy(
      {
        where: {
          id: reservationData.id,
        },
      },
      { transaction: t }
    );

    await db.Room.update(
      { activeTenant: roomData.activeTenant - reservationData.roomSlot },
      { where: { id: roomData.id } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "User Removed as Active Tenant" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.addUser = async (req, res) => {
  const { dormId, roomId, reservationId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const roomData = await findRoomData(roomId);
  const reservationData = await findReservationData(reservationId);

  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = addUserValidator(
    userData,
    dormitoryData,
    roomData,
    reservationData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    const updatedRoom = await db.Room.update(
      { activeTenant: roomData.activeTenant + reservationData.roomSlot },
      { where: { id: roomData.id } },
      { transaction: t }
    );

    await db.Reservation.update(
      { isActive: true, isAccepted: false, isPending: false },
      { where: { id: reservationData.id } },
      { transaction: t }
    );

    await t.commit();

    addUserMailer(reservationData, dormitoryData);

    return res.send({ msg: "User Added as Active Tenant" });
  } catch (err) {
    console.error(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//To accept new reservations
exports.acceptReservations = async (req, res) => {
  const { dormId, roomId, reservationId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const roomData = await findRoomData(roomId);
  const reservationData = await findReservationData(reservationId);

  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = acceptReservationsValidator(
    userData,
    dormitoryData,
    roomData,
    reservationData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    await db.Reservation.update(
      { isAccepted: true, isPending: false, isActive: false },
      { where: { id: reservationData.id } },
      { transaction: t }
    );

    await t.commit();

    acceptReservationMailer(reservationData, dormitoryData);

    return res.send({ msg: "User Reservation Accepted" });
  } catch (err) {
    console.error(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.rejectUserReservation = async (req, res) => {
  const dormitoryId = req.params.dormitoryId;
  const roomId = req.params.roomId;
  const reservationId = req.params.reservationId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const roomData = await findRoomData(roomId);
  const reservationData = await findReservationData(reservationId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = removeUserValidator(
    dormitoryData,
    roomData,
    reservationData,
    validRole
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.status)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.Reservation.destroy(
      { where: { id: reservationId } },
      { transaction: t }
    );
    await t.commit();

    rejectTenantReservationMailer(reservationData, dormitoryData);

    return res.send({ msg: "User Reservation Rejected" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.getReservationDetail = async (req, res) => {
  const reservationId = req.params.reservationId;
  const dormitoryId = req.params.dormitoryId;
  const roomId = req.params.roomId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const roomData = await findRoomData(roomId);
  const reservationData = await findReservationData(reservationId);

  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = getReservationDetailValidator(
    userData,
    dormitoryData,
    roomData,
    reservationData,
    validRole
  );
  if (validationResult !== null) {
    return res
      .statusCode(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    const reservationDetail = await db.Reservation.findOne({
      where: { id: reservationId },
    });

    return res.send({ reservationDetail });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.filterReservation = async (req, res) => {
  const dormitoryId = req.params.dormitoryId;
  const isActive = req.query.isActive;
  const isAccepted = req.query.isAccepted;
  const isPending = req.query.isPending;

  console.log(dormitoryId);
  console.log(isActive, isAccepted, isPending);

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = filterReservationValidator(
    userData,
    dormitoryData,
    validRole
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    const filteredReservation = await db.Reservation.findAll({
      where: { isPending, isActive, isAccepted },
    });

    return res.send({ filteredReservation });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.filterReservationByUserId = async (req, res) => {
  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "tenant");

  const validationResult = filterReservationByUserIdValidator(validRole);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    const userReservation = await db.Reservation.findAll({
      where: { userId: userData.id },
    });

    return res.send({ userReservation });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
