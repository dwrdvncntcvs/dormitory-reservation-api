const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData,findDormImageData } = require("../database/find");
const {
  is_roleValid,
  dormImageValidator,
  dormProfileImageValidator,
  dormDocumentValidator,
} = require("../validator/dormImageValidator");
const fs = require("fs");

exports.addDormImage = async (req, res) => {
  const { name, dormId } = req.body;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  const dormitoryData = await findDormitoryData(dormId);

  const t = await db.sequelize.transaction();
  try {
    await is_roleValid(validRole, t, res);

    await dormImageValidator(name, userData, dormitoryData, null, t, res);

    await db.DormImage.create(
      {
        name,
        filename: req.file.filename,
        filepath: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        dormitoryId: dormId,
      },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Image Successfully Added" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.deleteDormImage = async (req, res) => {
  const dormId = req.params.dormId;
  const imageId = req.params.imageId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const dormImageData = await findDormImageData(imageId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const t = await db.sequelize.transaction();
  try {
    await is_roleValid(validRole, t, res);

    await dormImageValidator(
      null,
      userData,
      dormitoryData,
      dormImageData,
      t,
      res
    );

    await fs.unlink(`image/dormImage/${dormImageData.filename}`, (err) => {
      if (err) console.log(err);
    })

    await db.DormImage.destroy(
      { where: { id: dormImageData.id } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Image Successfully Deleted" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.addDormitoryProfileImage = async (req, res) => {
  const { id } = req.body;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  const dormitoryData = await findDormitoryData(id);

  const t = await db.sequelize.transaction();
  try {
    await is_roleValid(validRole, t, res);

    await dormProfileImageValidator(userData, dormitoryData, t, res);

    await db.DormProfileImage.create({
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      dormitoryId: dormitoryData.id,
    });

    return res.send({ msg: "Dorm Profile Image Successfully Added" });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.addDormitoryDocuments = async (req, res) => {
  const { documentName, documentType, dormId } = req.body;

  const userData = req.user;
  const userDormData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const t = await db.sequelize.transaction();
  try {
    await is_roleValid(validRole, t, res);

    await dormDocumentValidator(
      documentName,
      documentType,
      userData,
      userDormData,
      t,
      res
    );

    await db.DormDocument.create(
      {
        documentName,
        documentType,
        dormitoryId: userDormData.id,
        filename: req.file.filename,
        filepath: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Dormitory Documents Successfully Added" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
