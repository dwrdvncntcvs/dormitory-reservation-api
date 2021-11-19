const db = require("../../models");
const validator = require("../validator/validator");
const fs = require("fs");
const { userValidator } = require("../validator/userValidator");
const { s3, createParams, getImageDetails } = require("../aws/s3");

exports.addProfilePic = async (req, res) => {
  const userData = req.user;

  const t = await db.sequelize.transaction();
  try {
    await userValidator(userData, res, t);

    const file = req.file;
    const { imageName, imageType } = getImageDetails(file);
    const params = createParams(file, imageName, imageType);

    s3.upload(params, async (err, data) => {
      if (err) {
        res.status(500).send(err);
      }

      await db.ProfileImage.create(
        {
          filename: imageName + imageType,
          filepath: data.Location,
          mimetype: req.file.mimetype,
          size: req.file.size,
          userId: userData.id,
        },
        { transaction: t }
      );
      await t.commit();

      return res.send({ msg: "Profile Image Uploaded" });
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.deleteProfileImage = async (req, res) => {
  const id = req.params.id;
  const userData = req.user;

  const image = await db.ProfileImage.findOne({ where: { id } });

  if (image.userId !== userData.id)
    return res.status(401).send({ msg: "Invalid User" });

  const t = await db.sequelize.transaction();
  try {
    await userValidator(userData, res, t);

    await db.ProfileImage.destroy(
      { where: { id: image.id } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Successfully Deleted" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.addUserDocuments = async (req, res) => {
  const { documentName, documentType } = req.body;
  const userData = req.user;

  const t = await db.sequelize.transaction();
  try {
    await userValidator(userData, res, t);

    const file = req.file;
    const { imageName, imageType } = getImageDetails(file);
    const params = createParams(file, imageName, imageType);

    s3.upload(params, async (err, data) => {
      if (err) {
        res.status(500).send(err);
      }

      const documents = await db.Document.create({
        documentName,
        documentType,
        filename: imageName + imageType,
        filepath: data.Location,
        mimetype: req.file.mimetype,
        size: req.file.size,
        userId: userData.id,
      });
      await t.commit();

      return res.send({ documents });
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
