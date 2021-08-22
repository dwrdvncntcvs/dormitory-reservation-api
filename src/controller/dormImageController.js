const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData, findDormImageData } = require("../database/find");

//To add dorm images
exports.addDormImage = async (req, res) => {
  const { name, dormId } = req.body;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  const dormitoryData = await findDormitoryData(dormId);

  const t = await db.sequelize.transaction();
  try {
    //Check user's role
    if (validRole === false) {
      await t.rollback();
      return res.status(401).send({ message: "Invalid User" });
    }

    if (name === "") {
      await t.rollback();
      return res.status(404).send({ msg: "Invalid Input" })
    }

    //Check if the dormitory was owned by the owner user
    if (userData.id !== dormitoryData.userId) {
      await t.rollback();
      return res.status(401).send({ message: "Dormitory not found" });
    }

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

//To delete dorm images
exports.deleteDormImage = async (req, res) => {
  const { imageId, dormId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const dormImageData = await findDormImageData(imageId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const t = await db.sequelize.transaction();
  try {
    if (validRole === false) {
      await t.rollback();
      return res.status(401).send({ msg: "Invalid User" });
    }

    if (!dormitoryData) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    if (!dormImageData) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory Image not found" });
    }

    if (dormitoryData.userId !== userData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    if (dormitoryData.id !== dormImageData.dormitoryId) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory Image not found" });
    }

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

//For Owner Users
//To add profile image of a dormitory.
exports.addDormitoryProfileImage = async (req, res) => {
  const { id } = req.body;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  const dormitory = await findDormitoryData(id);

  const t = await db.sequelize.transaction();
  try {
    //Check the role of the user
    if (validRole === false) {
      await t.rollback();
      return res.status(401).send({ msg: "Invalid User" });
    }

    //Check if the dormitory exist
    if (!dormitory) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    await db.DormProfileImage.create({
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      dormitoryId: dormitory.id,
    });

    return res.send({ msg: "Dorm Profile Image Successfully Added" });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//For Owner Users
//To create or add dormitory documents to be verified by admins
exports.addDormitoryDocuments = async (req, res) => {
  const { documentName, documentType, dormId } = req.body;

  const userData = req.user;
  const userDormData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const t = await db.sequelize.transaction();
  try {
    // Check user's role
    if (validRole === false) {
      await t.rollback();
      return res.status(401).send({ msg: "Invalid User" });
    }

    if (documentName === "" || documentType === "") {
      await t.rollback();
      return res.status(404).send({msg: "Invalid Input"})
    }

    //Check if dormitory does exist
    if (!userDormData) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    //Check if the dormitory exists owned by the right owner
    if (userDormData.userId !== userData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

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
