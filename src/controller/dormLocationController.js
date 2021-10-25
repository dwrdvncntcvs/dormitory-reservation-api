const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData, findLocationData } = require("../database/find");
const {
  dormLocationValidator,
  getLocationValidator,
} = require("../validator/dormLocationValidator");

exports.addDormitoryLocation = async (req, res) => {
  const { dormId, longitude, latitude } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const point = { type: "Point", coordinates: [latitude, longitude] };

  const validationResult = dormLocationValidator(
    req.body,
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
    await db.DormLocation.create(
      {
        dormitoryName: dormitoryData.name,
        address: dormitoryData.address,
        location: point,
        dormitoryId: dormitoryData.id,
      },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Dormitory Location Added" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.getDormitoryLocation = async (req, res) => {
  const dormitoryId = req.params.dormitoryId;
  const locationId = req.params.locationId;
  console.log("LOCATION ID: ", locationId)

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  const dormitoryData = await findDormitoryData(dormitoryId);
  const locationData = await findLocationData(locationId);

  const validationResult = getLocationValidator(
    validRole,
    dormitoryData,
    locationData
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    const dormLocation = await db.DormLocation.findOne({where: { id: locationData.id }});

    return res.send({ dormLocation });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.removeDormitoryLocation = async (req, res) => {
  const dormitoryId = req.params.dormitoryId;
  const locationId = req.params.locationId;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");
  const dormitoryData = await findDormitoryData(dormitoryId);
  const locationData = await findLocationData(locationId);

  const validationResult = getLocationValidator(
    validRole,
    dormitoryData,
    locationData
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.DormLocation.destroy(
      { where: { id: locationId } },
      { transaction: t }
    );
    await t.commit();

    return res.send({msg:"Location Deleted"})
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
