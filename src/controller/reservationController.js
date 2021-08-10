const db = require("../../models");
const validator = require("../validator/validator");

//For Tenant Users
//To create new reservation for tenants
exports.createNewReservation = async (req, res) => {
  const { dormId, roomId } = req.body;

  const user = req.user;
  const validRole = validator.isValidRole(user.role, "tenant");
  const dormitoryData = await db.Dormitory.findOne({
    where: { id: dormId },
  });
  const roomData = await db.Room.findOne({
    where: { id: roomId },
  });
  const userData = await db.User.findOne({
    where: { id: user.id },
  });

  const t = await db.sequelize.transaction();
  try {
    if (validRole === false) {
      return res.status(401).send({
        msg: "You are not a tenant user",
      });
    }

    if (userData.isVerified === false) {
      return res.status(401).send({
        msg: "Your account is not verified.", //To be change soon.
      });
    }

    if (!dormitoryData) {
      return res.status(404).send({
        msg: "Dormitory doesn't exist",
      });
    }

    if (dormitoryData.isVerified !== true) {
      return res.status(401).send({
        msg: "Dormitory is not available", //To be change soon.
      });
    }

    if (dormitoryData.allowedGender !== "both") {
      if (dormitoryData.allowedGender !== userData.gender) {
        return res.status(401).send({
          msg: `This dormitory only for ${dormitoryData.allowedGender}`, //To be change soon.
        });
      }
    }

    if (!roomData) {
      return res.status(404).send({
        msg: "Room doesn't exist",
      });
    }

    if (roomData.dormitoryId !== dormitoryData.id) {
      return res.status(401).send({
        msg: "This room doesn't belongs to the dormitory",
      });
    }

    const reservation = await db.Reservation.create(
      {
        dormitoryId: dormId,
        roomId,
        userId: userData.id,
        name: userData.name,
        email: userData.email,
        address: userData.address,
        contactNumber: userData.contactNumber,
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      msg: "Reservation Created.",
      reservation,
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//To cancel tenant's current reservations
/*
exports.cancelReservation = async (req, res) => {
  const { 
    reservationId, 
    dormitoryId,
    roomId
  } = req.body;
  const userData = req.user;
  const reservationData = await db.Reservation.findOne({
    where: { id: reservationId },
  });
  const dormitoryData = await db.Dormitory.findOne({
    where: { id: dormitoryId },
  });
  const roomData = await db.Room.findOne({
    where: { id: roomId },
  });
  const validRole = validator.isValidRole(userData.role, "tenant");

  const t = await db.sequelize.transation();
  try {
    if (validRole === false) {
      return res.status(401).send({
        msg: "You are not a tenant"
      });
    }

    if (!dormitoryData) {
      return res.status(404).send({
        msg: "Dormitory doesn't exist"
      });
    }

    if (!roomData) {
      return res.status(404).send({
        msg: "Room doesn't exist"
      });
    }

    if (!reservationData) {
      return res.status(404).send({
        msg: "Reservation doesn't exist"
      });
    }

    if (reservationData.roomId !== roomData.id) {
      return res.status(401).send({
        msg: "You can't cancel reservation"
      });
    }

    if (reservationData.dormitoryId !== dormitoryData.id) {
      return res.status(401).send({
        msg: "You can't cancel reservation"
      });
    }

    await db.Reservation.update({
      isCancelled
    }, {
      where: { id: reservationData.id }
    }, {
      transaction: t,
    });

    return res.send({  })
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.send({
      msg: "Something went wrong",
    });
  }
};
*/

//For Owner users
//To see all the new reservation of tenant Users
exports.viewAllRoomReservations = async (req, res) => {
  const roomId = req.params.roomId;
  const dormId = req.params.dormId;

  const userData = req.user;
  const roomData = await db.Room.findOne({
    where: { id: roomId },
  });
  const dormitoryData = await db.Dormitory.findOne({
    where: { id: dormId },
  });
  const validRole = validator.isValidRole(userData.role, "owner");

  try {
    if (validRole === false) {
      return res.status(401).send({
        msg: "Invalid Role",
      });
    }

    if (!dormitoryData) {
      return res.status(404).send({
        msg: "Dormitory not found",
      });
    }

    if (!roomData) {
      return res.status(404).send({
        msg: "Roomy not found",
      });
    }

    if (dormitoryData.id !== roomData.dormitoryId) {
      return res.status(401).send({
        msg: "Room doesn't belongs to the dormitory'",
      });
    }

    const newReservations = await db.Reservation.findAll({
      where: {
        dormitoryId: dormitoryData.id,
        roomId: roomData.id,
        isAccepted: false,
        isCancelled: false,
      },
      include: [db.Dormitory, db.Room],
    });

    return res.send({
      newReservations,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

exports.acceptReservations = async (req, res) => {
  const { dormId, roomId, reservationId, isAccepted } = req.body;

  const userData = req.user;
  const dormitoryData = await db.Dormitory.findOne({
    where: { id: dormId },
  });
  const roomData = await db.Room.findOne({
    where: { id: roomId },
  });
  const reservationData = await db.Reservation.findOne({
    where: { id: reservationId },
  });

  const validRole = validator.isValidRole(userData.role, "owner");
  const t = await db.sequelize.transaction();
  try {
    if (validRole === false) {
      return res.status(401).send({
        message: "You are not an owner.",
      });
    }

    if (!dormitoryData) {
      return res.status(404).send({
        message: "Dormitory not found.",
      });
    }

    if (!roomData) {
      return res.status(404).send({
        message: "Room not found.",
      });
    }

    if (!reservationData) {
      return res.status(404).send({
        message: "Reservation not found.",
      });
    }

    if (dormitoryData.userId !== userData.id) {
      return res.status(401).send({
        message: "You are not the owner of this dormitory.",
      });
    }

    if (dormitoryData.id !== roomData.dormitoryId) {
      return res.status(401).send({
        message: "This room doesn't belong to this dormitory.",
      });
    }

    if (reservationData.roomId !== roomData.id) {
      return res.status(401).send({
        message: "This reservation doesn't belong to this room.",
      });
    }

    const updatedReservation = await db.Reservation.update({
      isAccepted
    }, {
      where: { id: reservationData.id }
    }, {
      transaction: t
    });

    const updatedRoom = await db.Room.update({
      activeTenant: roomData.activeTenant + 1
    }, {
      where: { id: roomData.id }
    }, {
      transaction: t
    });
    await t.commit();

    return res.send({
      updatedReservation,
      updatedRoom,
    });
  } catch (err) {
    console.error(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};
