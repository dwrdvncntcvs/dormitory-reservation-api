const db = require("../../models");
const validator = require("../validator/validator");

//To Find Values in Database
const {
  findDormitoryData,
  findRoomData,
  findReservationData,
} = require("../database/find");

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

    if (dormitoryData.isAccepting !== true) {
      return res.status(401).send({
        msg: "Dormitory is not accepting right now", //To be change soon.
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
exports.cancelReservation = async (req, res) => {
  const { reservationId, dormitoryId, roomId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const roomData = await findRoomData(roomId);
  const reservationData = await findReservationData(reservationId);
  const validRole = validator.isValidRole(userData.role, "tenant");

  const t = await db.sequelize.transaction();
  try {
    if (validRole === false) {
      return res.status(401).send({
        msg: "You are not a tenant",
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

    if (!reservationData) {
      return res.status(404).send({
        msg: "Reservation doesn't exist",
      });
    }

    if (reservationData.roomId !== roomData.id) {
      return res.status(401).send({
        msg: "You can't cancel reservation",
      });
    }

    if (reservationData.dormitoryId !== dormitoryData.id) {
      return res.status(401).send({
        msg: "You can't cancel reservation",
      });
    }

    if (reservationData.userId !== userData.id) {
      return res.status(401).send({
        msg: "You can't cancel reservation",
      });
    }

    await db.Reservation.update(
      {
        isCancelled: true,
        isAccepted: false,
      },
      {
        where: { id: reservationData.id },
      },
      {
        transaction: t,
      }
    );

    await db.Room.update(
      {
        activeTenant: roomData.activeTenant - 1,
      },
      {
        where: { id: roomData.id },
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    return res.send({
      msg: "Reservation was successfully cancelled",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.send({
      msg: "Something went wrong",
    });
  }
};

//For Owner users
//To see all the new reservation of tenant Users
exports.viewAllPendingRoomReservations = async (req, res) => {
  const dormId = req.params.dormId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
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

    const newReservations = await db.Reservation.findAll({
      where: {
        dormitoryId: dormitoryData.id,
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

//To see all the accepted reservations of tenant users
exports.viewAllAcceptedRoomReservations = async (req, res) => {
  const dormId = req.params.dormId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  try {
    if (validRole === false) {
      return res.status(401).send({
        msg: "You are not an owner",
      });
    }

    if (!dormitoryData) {
      return res.status(404).send({
        msg: "Dormitory not found",
      });
    }

    const acceptedReservations = await db.Reservation.findAll({
      where: {
        dormitoryId: dormitoryData.id,
        isAccepted: true,
        isCancelled: false,
      },
      include: [db.Dormitory, db.Room],
    });

    return res.send({
      acceptedReservations,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//To remove reservation of the user
// exports.removeUser = async (req, res) => {
//   const { dormId, roomId, reservationId } = req.body;

//   const userData = req.user;
//   const dormitoryData = await findDormitoryData(dormId);
//   const roomData = await findRoomData(roomId);
//   const reservationData = await findReservationData(reservationId);
//   const validRole = validator.isValidRole(userData.role, "owner");

//   const t = await db.sequelize.transaction();
//   try {
//     if (validRole === false) {
//       return res.status(401).send({
//         msg: "Invalid role",
//       });
//     }

//     if (!dormitoryData) {
//       return res.status(404).send({
//         msg: "Dormitory does not exist",
//       });
//     }

//     if (!roomData) {
//       return res.status(404).send({
//         msg: "Room does not exist",
//       });
//     }

//     if (!reservationData) {
//       return res.status(404).send({
//         msg: "Reservation does not exist",
//       });
//     }

//     if (dormitoryData.id !== roomData.dormitoryId) {
//       return res.status(401).send({
//         msg: "Room does not belongs to the dormitory",
//       });
//     }

//     if (
//       reservationData.roomId !== roomData.id &&
//       reservationData.dormitoryId !== dormitoryData.id
//     ) {
//       return res.status(401).send({
//         msg: "Reservation does not belong to this dormitory and room",
//       });
//     }

//     await db.Reservation.destroy({
//       where: {
//         isAccepted: true,
//         isCancelled: false,
//         id: reservationData.id,
//       },
//     }, {
//       transaction: t,
//     });
//     await t.commit();

//     return res.send({ msg: "Reservation removed." });
//   } catch (err) {
//     console.log(err);
//     await t.rollback();
//     return res.status(500).send({
//       msg: "Something went wrong",
//     });
//   }
// };

exports.addUser = async (req, res) => {
  const { dormId, roomId, reservationId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const roomData = await findRoomData(roomId);
  const reservationData = await findReservationData(reservationId);

  const validRole = validator.isValidRole(userData.role, "owner");
  const t = await db.sequelize.transaction();

  try {
    if (validRole === false) {
      return res.status(401).send({ message: "Invalid Role" });
    }

    if (!dormitoryData) {
      return res.status(404).send({ msg: "Dormitory does not exist" });
    }

    if (!roomData) {
      return res.status(404).send({ msg: "Room does not exist" });
    }

    if (!reservationData) {
      return res.status(404).send({ msg: "Reservation does not exist" });
    }

    if (userData.id !== dormitoryData.userId) {
      return res
        .status(401)
        .send({ msg: "Dormitory doesn't belong to this user" });
    }

    if (dormitoryData.id !== roomData.dormitoryId) {
      return res
        .status(401)
        .send({ msg: "Room doesn't belong to this dormitory" });
    }

    if (roomData.id !== reservationData.roomId) {
      return res
        .status(401)
        .send({ msg: "Reservation doesn't belong to this room" });
    }

    if (roomData.activeTenant >= roomData.capacity) {
      return res.status(401).send({ msg: "Room is full" });
    }

    if (reservationData.isAccepted === false) {
      return res.status(401).send({ msg: "You are not yet accepted"})
    }

    if (reservationData.isAdded === true) {
      return res.send({ msg: "User Already added" });
    }
    
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

    return res.send({
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

    const updatedReservation = await db.Reservation.update(
      {
        isAccepted,
      },
      {
        where: { id: reservationData.id },
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    return res.send({
      updatedReservation,
    });
  } catch (err) {
    console.error(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};
