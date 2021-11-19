const db = require("../../models");
const validator = require("../validator/validator");
const {
  findDormitoryData,
  findDormImageData,
  findDormProfileImageData,
} = require("../database/find");
const {
  addDormImagevalidator,
  deleteDormImageValidator,
  addDormitoryProfileImageValidator,
  addDormitoryDocuments,
  removeDormitoryProfileImageValidator,
} = require("../validator/dormImageValidator");
const { s3, createParams, getImageDetails } = require("../aws/s3");

exports.addDormImage = async (req, res) => {
  const { name, dormId } = req.body;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  const dormitoryData = await findDormitoryData(dormId);

  const validationResult = addDormImagevalidator(
    dormitoryData,
    name,
    userData,
    validRole
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    const file = req.file;
    const { imageName, imageType } = getImageDetails(file);
    const params = createParams(file, imageName, imageType);

    s3.upload(params, async (err, data) => {
      if (err) {
        res.status(500).send(err);
      }

      await db.DormImage.create(
        {
          name,
          filename: imageName + imageType,
          filepath: data.Location,
          mimetype: req.file.mimetype,
          size: req.file.size,
          dormitoryId: dormId,
        },
        { transaction: t }
      );
      await t.commit();

      return res.send({ msg: "Image Successfully Added" });
    });
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

  const validationResult = deleteDormImageValidator(
    dormitoryData,
    dormImageData,
    userData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
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

  const validationResult = addDormitoryProfileImageValidator(
    validRole,
    dormitoryData,
    userData
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    const file = req.file;
    const { imageName, imageType } = getImageDetails(file);
    const params = createParams(file, imageName, imageType);

    s3.upload(params, async (err, data) => {
      if (err) {
        res.status(500).send(err);
      }

      await db.DormProfileImage.create(
        {
          filename: imageName + imageType,
          filepath: data.Location,
          mimetype: req.file.mimetype,
          size: req.file.size,
          dormitoryId: dormitoryData.id,
        },
        { transaction: t }
      );
      await t.commit();

      return res.send({ msg: "Dorm Profile Image Successfully Added" });
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.removeDormitoryProfileImage = async (req, res) => {
  const dormId = req.params.dormId;
  const profileImageId = req.params.profileImageId;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  const dormitoryData = await findDormitoryData(dormId);
  const dormProfileImageData = await findDormProfileImageData(profileImageId);

  const validationResult = removeDormitoryProfileImageValidator(
    userData,
    validRole,
    dormitoryData,
    dormProfileImageData
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    await db.DormProfileImage.destroy(
      {
        where: { id: dormProfileImageData.id },
      },
      { transaction: t }
    );
    await t.commit();

    return res
      .status(200)
      .send({ msg: "Dormitory Profile Image deleted successfully" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.addDormitoryDocuments = async (req, res) => {
  const { documentName, documentType, dormId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = addDormitoryDocuments(
    documentName,
    documentType,
    userData,
    dormitoryData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    const file = req.file;
    const { imageName, imageType } = getImageDetails(file);
    const params = createParams(file, imageName, imageType);

    s3.upload(params, async (err, data) => {
      if (err) {
        res.status(500).send(err);
      }

      await db.DormDocument.create(
        {
          documentType,
          dormitoryId: dormitoryData.id,
          filename: imageName + imageType,
          filepath: data.Location,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
        { transaction: t }
      );
      await t.commit();

      return res.send({ msg: "Dormitory Documents Successfully Added" });
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
