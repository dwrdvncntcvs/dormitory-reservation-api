const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData, findRoomData } = require("../database/find");
const {
  createNewRoomValidator,
  updateRoomPaymentValidator,
  deleteRoomValidator,
  getRoomDetailValidator,
} = require("../validator/roomValidator");

exports.createNewRoom = async (req, res) => {
  const {
    dormId,
    roomName,
    activeTenant,
    roomCapacity,
    roomCost,
    electricBill,
    waterBill,
  } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);

  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = createNewRoomValidator(
    req.body,
    userData,
    dormitoryData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    const roomDetail = await db.Room.create(
      {
        name: roomName,
        activeTenant,
        capacity: roomCapacity,
        dormitoryId: dormId,
        roomCost,
        electricBill,
        waterBill,
      },
      { transaction: t }
    );
    await t.commit();

    return res.send({ roomDetail });
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.updateRoomPayment = async (req, res) => {
  const { dormId, roomId, roomCost, electricBill, waterBill } = req.body;

  const userData = req.user;
  const roomData = await findRoomData(roomId);
  const dormitoryData = await findDormitoryData(dormId);

  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = updateRoomPaymentValidator(
    req.body,
    userData,
    roomData,
    dormitoryData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    await db.Room.update(
      { roomCost, electricBill, waterBill },
      { where: { id: roomId } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Room Payment Update Success" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.deleteRoom = async (req, res) => {
  const dormitoryId = req.params.dormitoryId;
  const roomId = req.params.roomId;

  console.log("DORMITORY ID: ", dormitoryId);

  const userData = req.user;
  const roomData = await findRoomData(roomId);
  const dormitoryData = await findDormitoryData(dormitoryId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = deleteRoomValidator(
    validRole,
    userData,
    dormitoryData,
    roomData
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();

  try {
    await db.Room.destroy({ where: { id: roomId } }, { transaction: t });
    await t.commit();

    return res.send({ msg: "Room deleted successfully" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.getRoomDetail = async (req, res) => {
  const roomId = req.params.roomId;
  const dormitoryId = req.params.dormitoryId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const roomData = await findRoomData(roomId);

  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = getRoomDetailValidator(
    dormitoryData,
    roomData,
    userData,
    validRole
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    const roomDetail = await db.Room.findOne({ where: { id: roomId } });

    return res.send({ roomDetail });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
