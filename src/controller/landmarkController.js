const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData, findLandmarkData } = require("../database/find");
const {
  addLandmarkValidator,
  deleteLandmarkValidator,
} = require("../validator/landmarkValidator");

exports.addLandmark = async (req, res) => {
  const { landmark, latitude, longitude, dormId } = req.body;

  const point = { type: "Point", coordinates: [latitude, longitude] };
  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = addLandmarkValidator(
    landmark,
    point,
    validRole,
    dormitoryData,
    userData
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    await db.Landmark.create(
      {
        name: landmark,
        location: point,
        dormitoryId: dormId,
      },
      { transaction: t }
    );
    await t.commit();

    return res.status(200).send({ msg: "Landmark Successfully Added " });
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.deleteLandmark = async (req, res) => {
  const dormitoryId = req.params.dormitoryId;
  const landmarkId = req.params.landmarkId;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  const dormitoryData = await findDormitoryData(dormitoryId);
  const landmarkData = await findLandmarkData(landmarkId);

  const validationResult = deleteLandmarkValidator(
    validRole,
    dormitoryData,
    landmarkData
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();

  try {
    await db.Landmark.destroy(
      { where: { id: landmarkId } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Landmark deleted successfully" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
