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

//For Tenant Users
//To create new reservation for tenants
exports.createNewReservation = async (req, res) => {
  const { dormId, roomId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const roomData = await findRoomData(roomId);
  const validRole = validator.isValidRole(userData.role, "tenant");

  const t = await db.sequelize.transaction();
  try {
    await createNewReservationValidator(
      userData,
      dormitoryData,
      roomData,
      validRole,
      t,
      res
    );

    await db.Reservation.create(
      {
        dormitoryId: dormId,
        roomId,
        userId: userData.id,
        name: userData.name,
        email: userData.email,
        address: userData.address,
        contactNumber: userData.contactNumber,
      },
      { transaction: t }
    );
    await t.commit();

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

  const t = await db.sequelize.transaction();
  try {
    await cancelReservationValidator(
      userData,
      dormitoryData,
      roomData,
      reservationData,
      validRole,
      t,
      res
    );

    await db.Reservation.update(
      { isCancelled: true, isAccepted: false },
      { where: { id: reservationData.id } },
      { transaction: t }
    );

    await db.Room.update(
      { activeTenant: roomData.activeTenant - 1 },
      { where: { id: roomData.id } },
      { transaction: t }
    );

    await t.commit();

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

  try {
    viewAllReservationsValidator(userData, dormitoryData, validRole, res);

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

  const t = await db.sequelize.transaction();
  try {
    await removeUserValidator(
      dormitoryData,
      roomData,
      reservationData,
      validRole,
      t,
      res
    );

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
  const t = await db.sequelize.transaction();

  try {
    await addUserValidator(
      userData,
      dormitoryData,
      roomData,
      reservationData,
      validRole,
      t,
      res
    );

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
  const t = await db.sequelize.transaction();
  try {
    await acceptReservationsValidator(
      userData,
      dormitoryData,
      roomData,
      reservationData,
      validRole,
      t,
      res
    );

    const updatedReservation = await db.Reservation.update(
      { isAccepted },
      { where: { id: reservationData.id } },
      { transaction: t }
    );

    await t.commit();

    return res.send({ updatedReservation });
  } catch (err) {
    console.error(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
