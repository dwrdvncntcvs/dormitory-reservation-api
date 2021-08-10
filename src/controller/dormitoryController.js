const db = require("../../models");
const validator = require("../validator/validator");

//For Owner Users
//To create and input new information of a dormitory in the system.
exports.createNewDormitory = async (req, res) => {
  const { name, address, contactNumber, allowedGender } = req.body;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  const t = await db.sequelize.transaction();
  try {
    //Check the user role
    if (validRole === false) {
      return res.status(401).send({
        msg: "You are not an owner.",
      });
    }

    //Check if the user is verified
    if (userData.isVerified !== true) {
      return res.status(401).send({
        msg: "Your account is not verified.", //To be change soon.
      });
    }

    //Check the field if not empty
    if (name === null && address === null && contactNumber === null && allowedGender === null) {
      return res.status(401).send({
        msg: "Can't submit empty field.", //To be change soon.
      });
    }

    await db.Dormitory.create(
      {
        name,
        address,
        contactNumber,
        allowedGender,
        userId: userData.id,
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      msg: "Dormitory Successfully Created.",
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//For Owner Users
//To view all the dormitory created by the user.
exports.viewUserDormitory = async (req, res) => {
  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  try {
    //Check user role
    if (validRole === false) {
      return res.status(401).send({
        msg: "You are not a dormitory owner.",
      });
    }

    const userDormitories = await db.Dormitory.findAll({
      where: { userId: userData.id },
      include: [db.User, db.DormProfileImage, db.Reservation],
    });

    return res.send({
      userDormitories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//For Owner Users
//To delete dormitory
exports.deleteDormitory = async (req, res) => {
  const { id } = req.body;
  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");

  const t = await db.sequelize.transaction();
  try {
    //Check the role of the user
    if (validRole === false) {
      return res.status(401).send({
        msg: "You are not an owner",
      });
    }

    await db.Dormitory.destroy(
      {
        where: { id },
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      msg: "Dormitory was successfully deleted",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//For Owner Users
//To view the dormitories detail of an owner.
exports.viewUserDormitoryDetail = async (req, res) => {
  const dormId = req.params.dormId;

  const userData = req.user;
  const dormitoryData = await db.Dormitory.findOne({
    where: { id: dormId },
  });
  console.log(userData);
  const validRole = validator.isValidRole(userData.role, "owner");

  try {
    //Check the role of the user
    if (validRole === false) {
      return res.status(401).send({ msg: "You are not an owner." });
    }

    //Check if the dormitory does exist
    if (!dormitoryData) {
      return res.status(401).send({ msg: "Dormitory doesn't exists." });
    }

    //Check if the dormitory exists owned by the right owner
    if (dormitoryData.userId !== userData.id) {
      return res
        .status(401)
        .send({ msg: "You are not the owner of this dorm." });
    }

    const room = await db.Room.findAll({
      where: { dormitoryId: dormitoryData.id },
    });

    const dormDocument = await db.DormDocument.findAll({
      where: { dormitoryId: dormitoryData.id },
    });

    const dormImage = await db.DormImage.findAll({
      where: { dormitoryId: dormitoryData.id },
    });

    const dormProfileImage = await db.DormProfileImage.findAll({
      where: { dormitoryId: dormitoryData.id },
    });

    const dormReservation = await db.Reservation.findAll({
      where: { dormitoryId: dormitoryData.id }
    });

    return res.send({
      dormitory: {
        dormitoryData,
        dormDocument,
        room,
        dormImage,
        dormProfileImage,
        dormReservation,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//For Owner Users
//To determine if the availability of the dormitory
exports.dormitorySwitch = async (req, res) => {
  const { dormId, isAccepting } = req.body;

  const userData = req.user;
  const dormitoryData = await db.Dormitory.findOne({
    where: { id: dormId },
  });
  const validRole = validator.isValidRole(userData.role, "owner");

  const t = await db.sequelize.transaction();
  try {
    //Check the role of the userData
    if (validRole === false) {
      return res.status(401).send({
        msg: "You are not an owner",
      });
    }

    //Check if the dormitory does exist in the database
    if (!dormitoryData) {
      return res.status(404).send({
        msg: "Dormitory does not exist in the database",
      });
    }

    //Check if the dormitory is owned by the user
    if (dormitoryData.userId !== userData.id) {
      return res.status(401).send({
        msg: "You are not the owner of this dormitory",
      });
    }

    await db.Dormitory.update(
      {
        isAccepting,
      },
      {
        where: { id: dormitoryData.id },
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      msg: "Your dormitory availability status has been updated",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

