const db = require("../../models");
const validator = require("../validator/validator");
const fs = require("fs");
const { userValidator } = require("../validator/userValidator")

//ADD PROFILE IMAGE
//Need to change on how to get the ID of the user later.
//This needs the user to be authenticated before adding a profile image
exports.addProfilePic = async (req, res) => {
  const userData = req.user;

  const t = await db.sequelize.transaction();
  try {
    await userValidator(userData, res, t);

    await db.ProfileImage.create(
      {
        filename: req.file.filename,
        filepath: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        userId: userData.id,
      },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Profile Image Uploaded" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//DELETE PROFILE IMAGE
exports.deleteProfileImage = async (req, res) => {
  const userData = req.user;

  const t = await db.sequelize.transaction();
  try {
    await userValidator(userData, res, t);

    await db.ProfileImage.destroy(
      { where: { userId: userData.id } },
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

//To add new documents
exports.addUserDocuments = async (req, res) => {
  const { documentName, documentType } = req.body;
  const userData = req.user;

  const t = await db.sequelize.transaction();
  try {
    await userValidator(userData, res, t);

    const documents = await db.Document.create({
      documentName,
      documentType,
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      userId: userData.id,
    });
    await t.commit();

    return res.send({ documents });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
