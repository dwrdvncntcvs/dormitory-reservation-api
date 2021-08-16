const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData, findRoomData } = require("../database/find");

// To create new room in a dormitory
exports.createNewRoom = async (req, res) => {
  const { dormId, roomName, roomCapacity, roomCost, electricBill, waterBill } =
    req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);

  const validRole = validator.isValidRole(userData.role, "owner");
  const t = await db.sequelize.transaction();
  try {
    //Check Role
    if (validRole === false) {
      return res.status(401).send({
        msg: "Invalid User",
      });
    }

    //Check if the dorm exists
    if (!dormitoryData) {
      return res.status(401).send({
        msg: "Dormitory not found",
      });
    }

    //Check if right user
    if (userData.id !== dormitoryData.userId) {
      return res.status(401).send({
        msg: "Dormitory not found",
      });
    }

    //Check if dorm is verified
    if (dormitoryData.isVerified === false) {
      return res.status(401).send({
        msg: "Dormitory is not verified",
      });
    }

    const roomDetail = await db.Room.create(
      {
        name: roomName,
        capacity: roomCapacity,
        dormitoryId: dormId,
        roomCost,
        electricBill,
        waterBill,
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      roomDetail,
    });
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//To update the payment bills of a room
exports.updateRoomPayment = async (req, res) => {
  const { dormId, roomId, roomCost, electricBill, waterBill } = req.body;

  const userData = req.user;
  const roomData = await findRoomData(roomId);
  const dormitoryData = await findDormitoryData(dormId);

  const validRole = validator.isValidRole(userData.role, "owner");
  const t = await db.sequelize.transaction();
  try {
    //Checks if the role of the signed in user is owner
    if (validRole == false) {
      return res.status(401).send({
        msg: "Invalid User",
      });
    }

    // Checks if the dormitory does exist in the database
    if (!dormitoryData) {
      return res.status(401).send({
        msg: "Dormitory not found",
      });
    }

    //Checks if the room does exist in the database
    if (!roomData) {
      return res.status(401).send({
        msg: "Room not found",
      });
    }

    // Checks if the dormitory is owned by the signed in user
    if (dormitoryData.userId !== userData.id) {
      return res.status(401).send({
        msg: "Dormitory not found",
      });
    }

    //Checks if the room belongs to the dormitory
    if (dormitoryData.id !== roomData.dormitoryId) {
      return res.status(401).send({
        msg: "Room not found",
      });
    }

    //To update the payment bills of the specific room
    await db.Room.update(
      {
        roomCost,
        electricBill,
        waterBill,
      },
      {
        where: { id: roomId },
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      msg: "Room Payment Update Success",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};
