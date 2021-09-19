const db = require("../../models");
const validator = require("../validator/validator");
const fs = require("fs");
const { is_roleValid, verifyDormitory } = require("../validator/userValidator");
const { findDormitoryData } = require("../database/find");

//For ADMIN only.
//This function will let the admins to manually or perssonaly validate
//users depends on the documents or ids that they will uploading.
exports.displayAllUsers = async (req, res) => {
  const userData = req.user;

  const validRole = validator.isValidRole(userData.role, "admin");
  
  const validationResult = is_roleValid(validRole);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    const adminUsers = await db.User.findAll({
      where: { role: "admin" },
      include: [db.ProfileImage, db.Document],
    });

    const ownerUsers = await db.User.findAll({
      where: { role: "owner" },
      include: [db.ProfileImage, db.Document, db.Dormitory],
    });

    const tenantUsers = await db.User.findAll({
      where: { role: "tenant" },
      include: [db.ProfileImage, db.Document],
    });

    return res.send({ adminUsers, ownerUsers, tenantUsers });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//TO VERIFY THE USERS
exports.verifyUser = async (req, res) => {
  const { id, isVerified } = req.body;
  const userData = req.user;

  const validRole = validator.isValidRole(userData.role, "admin");
  const validationResult = is_roleValid(validRole);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.User.update({ isVerified }, { where: { id } }, { transaction: t });
    await t.commit();

    return res.send({ msg: "Account Successfully Verified" });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(404).send({ msg: "Something went wrong" });
  }
};

//DELETE USER INFORMATION
//Delete functionality that an admin user can only access.
//This function is not yet complete until this comment is deleted.
exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  const userData = req.user;

  const validRole = validator.isValidRole(userData.role, "admin");
  const validationResult = is_roleValid(validRole);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    const user = await db.User.findOne({ where: { id: id } });

    await db.User.destroy({ where: { id: user.id } }, { transaction: t });

    await t.commit();
    return res.send({ msg: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//To verify a dormitory to add things such as rooms and payments
exports.verifyDormitory = async (req, res) => {
  const { dormId, isVerified } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "admin");

 const validationResult = verifyDormitory(validRole, dormitoryData);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.Dormitory.update(
      { isVerified },
      { where: { id: dormId } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Your dormitory is now verified" });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
