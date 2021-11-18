const db = require("../../models");
const validator = require("../validator/validator");
const {
  is_roleValid,
  verifyDormitory,
  userValidator,
  displayDormitoryDetail,
  denyDormitoryValidator,
  denyUserValidator,
} = require("../validator/userValidator");
const {
  findDormitoryData,
  findUserData,
  findDormitoryDocumentSegment,
  findUserDocumentsData,
} = require("../database/find");
const {
  dormitoryVerifiedNotice,
  userVerifiedNotice,
  deniedDormitoryNotice,
  deniedUserNotice,
} = require("../mailer/mailer");
const { Op } = require("sequelize");
const userFilter = require("../database/userFilter");
const fs = require("fs");

exports.displayAllUsers = async (req, res) => {
  const role = req.params.role;
  const filter = req.query.filter;

  const userData = req.user;

  const validRole = validator.isValidRole(userData.role, "admin");

  const validationResult = is_roleValid(validRole);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    if (role === "all") {
      const adminUsers = await db.User.findAll({
        where: {
          role: "admin",
          [Op.or]: [userFilter.getValue(filter, "admin")],
        },
      });

      const ownerUsers = await db.User.findAll({
        where: {
          role: "owner",
          [Op.or]: [userFilter.getValue(filter, "owner")],
        },
      });

      const tenantUsers = await db.User.findAll({
        where: {
          role: "tenant",
          [Op.or]: [userFilter.getValue(filter, "tenant")],
        },
      });

      return res.send({ adminUsers, ownerUsers, tenantUsers });
    } else if (role === "admin") {
      const adminUsers = await db.User.findAll({
        where: {
          role: role,
          [Op.or]: [userFilter.getValue(filter, role)],
        },
      });

      return res.send({ adminUsers });
    } else if (role === "owner") {
      const ownerUsers = await db.User.findAll({
        where: {
          role: role,
          [Op.or]: [userFilter.getValue(filter, role)],
        },
      });

      return res.send({ ownerUsers });
    } else if (role === "tenant") {
      const tenantUsers = await db.User.findAll({
        where: {
          role: role,
          [Op.or]: [userFilter.getValue(filter, role)],
        },
      });

      return res.send({ tenantUsers });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.userDetails = async (req, res) => {
  const userId = req.params.userId;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "admin");

  const validationResult = is_roleValid(validRole);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    const userDetail = await db.User.findOne({
      where: { id: userId },
      include: [db.ProfileImage, db.Document],
    });

    return res.send({ userDetail });
  } catch (err) {
    console.log(err);
  }
};

exports.displayAllDormitories = async (req, res) => {
  const filter = req.params.filter;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "admin");

  const validationResult = is_roleValid(validRole);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    const bothDormitories = await db.Dormitory.findAll({
      where: { isVerified: filter, allowedGender: "both" },
      include: [db.User],
    });

    const maleDormitories = await db.Dormitory.findAll({
      where: { isVerified: filter, allowedGender: "male" },
      include: [db.User],
    });

    const femaleDormitories = await db.Dormitory.findAll({
      where: { isVerified: filter, allowedGender: "female" },
      include: [db.User],
    });

    return res
      .status(200)
      .send({ bothDormitories, femaleDormitories, maleDormitories });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.displayDormitoryDetail = async (req, res) => {
  const dormitoryId = req.params.dormitoryId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const validRole = validator.isValidRole(userData.role, "admin");

  const validationResult = displayDormitoryDetail(validRole, dormitoryData);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    const payment = await db.Payment.findOne({
      where: { dormitoryId: dormitoryId, isValid: false },
    });
    const dormitory = await db.Dormitory.findOne({
      where: { id: dormitoryId },
      include: [db.DormProfileImage, db.DormDocument, db.User],
    });
    return res.send({ dormitory, payment });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.verifyUser = async (req, res) => {
  const { id, isVerified } = req.body;
  const user = req.user;

  const userData = await findUserData(id);
  const validRole = validator.isValidRole(user.role, "admin");
  const validationResult = userValidator(validRole, userData);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.User.update({ isVerified }, { where: { id } }, { transaction: t });
    await t.commit();

    userVerifiedNotice(userData);

    return res.send({ msg: "Account Successfully Verified" });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(404).send({ msg: "Something went wrong" });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = req.user;

  const userData = await findUserData(id);
  const validRole = validator.isValidRole(user.role, "admin");
  const validationResult = userValidator(validRole, userData);
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

exports.verifyDormitory = async (req, res) => {
  const { userId, dormId, isVerified } = req.body;

  const userData = req.user;
  const userToBeMailed = await findUserData(userId);
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

    dormitoryVerifiedNotice(userToBeMailed, dormitoryData);

    return res.send({ msg: "Your dormitory is now verified" });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.denyDormitory = async (req, res) => {
  const dormitoryId = req.params.dormitoryId;
  const userId = req.params.userId;

  const userData = req.user;
  const userToBeMailed = await findUserData(userId);
  const dormitoryData = await findDormitoryData(dormitoryId);
  const validRole = validator.isValidRole(userData.role, "admin");
  const dormitoryDocumentData = await findDormitoryDocumentSegment(dormitoryId);

  const validationResult = denyDormitoryValidator(
    validRole,
    dormitoryData,
    userToBeMailed,
    dormitoryDocumentData
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    for (let document of dormitoryDocumentData) {
      const fileLink = `image/dormDocumentImage/${document.filename}`;

      await fs.unlink(fileLink, (err) => {
        console.log(err);
      });

      await db.DormDocument.destroy(
        { where: { id: document.id } },
        { transaction: t }
      );
      await t.commit();

      deniedDormitoryNotice(dormitoryData, userToBeMailed);
      return res.send({ msg: "Email successfully send." });
    }
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.denyUsers = async (req, res) => {
  const userId = req.params.userId;

  const userData = req.user;
  const userToBeMailed = await findUserData(userId);
  const validRole = validator.isValidRole(userData.role, "admin");
  const userDocumentsData = await findUserDocumentsData(userId);

  const validationResult = denyUserValidator(
    validRole,
    userToBeMailed,
    userDocumentsData
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    for (let document of userDocumentsData) {
      const fileLink = `image/documentImage/${document.filename}`;

      await fs.unlink(fileLink, (err) => {
        console.log(err);
      });

      await db.Document.destroy(
        { where: { id: document.id } },
        { transaction: t }
      );
      await t.commit();

      deniedUserNotice(userToBeMailed);
      return res.send({ msg: "Email Successfully Sent" });
    }
  } catch (e) {
    console.log(error);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
