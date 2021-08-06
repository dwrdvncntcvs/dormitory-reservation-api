const db = require("../../models");
const validator = require("../validator/validator");

// To create new room in a dormitory
exports.createNewRoom = async (req, res) => {
  const { dormId, roomName, roomCapacity, roomCost, electricBill, waterBill } =
    req.body;

  const userData = req.user;
  const dormitoryData = await db.Dormitory.findOne({
    where: { id: dormId },
  });

  const validRole = validator.isValidRole(userData.role, "owner");
  const t = await db.sequelize.transaction();
  try {
    //Check Role
    if (validRole === false) {
      return res.status(401).send({
        msg: "You are not an owner.",
      });
    }

    //Check if the dorm exists
    if (!dormitoryData) {
      return res.status(401).send({
        msg: "Dormitory doesn't exists",
      });
    }

    //Check if right user
    if (userData.id !== dormitoryData.userId) {
      return res.status(401).send({
        msg: "You can't create a room for this dormitory.",
      });
    }

    //Check if dorm is verified
    if (dormitoryData.isVerified === false) {
      return res.status(401).send({
        msg: "Your dormitory is not verified",
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
  const roomData = await db.Room.findOne({
    where: { id: roomId },
  });
  const dormitoryData = await db.Dormitory.findOne({
    where: { id: dormId },
  });

  const validRole = validator.isValidRole(userData.role, "owner");
  const t = await db.sequelize.transaction();
  try {
    // Checks if the dormitory does exist in the database
    if (!dormitoryData) {
      return res.status(401).send({
        msg: "Dormitory doesn't exist",
      });
    }

    //Checks if the room does exist in the database
    if (!roomData) {
      return res.status(401).send({
        msg: "Room doesn't exist",
      });
    }

    //Checks if the role of the signed in user is owner
    if (validRole == false) {
      return res.status(401).send({
        msg: "You are not an owner",
      });
    }

    //Checks if the room belongs to the dormitory
    if (dormitoryData.id !== roomData.dormitoryId) {
      return res.status(401).send({
        msg: "This room doesn't belongs to this dormitory",
      });
    }

    // Checks if the dormitory is owned by the signed in user
    if (dormitoryData.userId !== userData.id) {
      return res.status(401).send({
        msg: "This dormitory is not yours",
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
