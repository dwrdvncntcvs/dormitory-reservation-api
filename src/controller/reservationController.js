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
} = require("../validator/reservationValidator");
const {
  createReservationMailer,
  cancelReservationMailer,
  addUserMailer,
  acceptReservationMailer,
} = require("../mailer/reservationMailer");

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
        userId: userData.id,
        name: userData.name,
        email: userData.email,
        address: userData.address,
        contactNumber: userData.contactNumber,
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
  const { reservationId, dormitoryId, roomId } = req.body;

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
    await db.Reservation.update(
      { isCancelled: true, isAccepted: false },
      { where: { id: reservationData.id } },
      { transaction: t }
    );

    // await db.Room.update(
    //   { activeTenant: roomData.activeTenant - 1 },
    //   { where: { id: roomData.id } },
    //   { transaction: t }
    // );

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
        isCancelled: false,
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
  const { dormId, roomId, reservationId } = req.body;

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
          isAccepted: true,
          isCancelled: false,
          id: reservationData.id,
        },
      },
      { transaction: t }
    );

    await db.Room.update(
      { activeTenant: roomData.activeTenant - 1 },
      { where: { id: roomData.id } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Reservation removed." });
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
      { activeTenant: roomData.activeTenant + 1 },
      { where: { id: roomData.id } },
      { transaction: t }
    );

    await db.Reservation.update(
      { isActive: true },
      { where: { id: reservationData.id } },
      { transaction: t }
    );

    await t.commit();

    addUserMailer(reservationData, dormitoryData);

    return res.send({ updatedRoom });
  } catch (err) {
    console.error(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//To accept new reservations
exports.acceptReservations = async (req, res) => {
  const { dormId, roomId, reservationId, isAccepted } = req.body;

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
    const updatedReservation = await db.Reservation.update(
      { isAccepted },
      { where: { id: reservationData.id } },
      { transaction: t }
    );

    await t.commit();

    acceptReservationMailer(reservationData, dormitoryData);

    return res.send({ updatedReservation });
  } catch (err) {
    console.error(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
