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
    where: { id: user.id }
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
        msg: "Invalid Role"
      });
    }

    if (!dormitoryData) {
      return res.status(404).send({
        msg: "Dormitory not found"
      });
    }

    if (!roomData) {
      return res.status(404).send({
        msg: "Roomy not found"
      });
    }

    if (dormitoryData.id !== roomData.dormitoryId) {
      return res.status(401).send({
        msg: "Room doesn't belongs to the dormitory'"
      });
    }

    const newReservations = await db.Reservation.findAll({
      where: { 
        dormitoryId: dormitoryData.id,
        roomId: roomData.id,
        isAccepted: false,
        isCancelled: false,
      }
    });

    return res.send({
      newReservations
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};