const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData, findRoomData } = require("../database/find");
const {
  createNewRoomValidator,
  updateRoomPaymentValidator,
} = require("../validator/roomValidator");

// To create new room in a dormitory
exports.createNewRoom = async (req, res) => {
  const { dormId, roomName, roomCapacity, roomCost, electricBill, waterBill } =
    req.body;

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

//To update the payment bills of a room
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
    //To update the payment bills of the specific room
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
