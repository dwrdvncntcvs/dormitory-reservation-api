const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData } = require("../database/find");
const { dormLocationValidator } = require("../validator/dormLocationValidator");

exports.addDormitoryLocation = async (req, res) => {
  const { dormId, longitude, latitude } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const point = { type: "Point", coordinates: [latitude, longitude] };

  const t = await db.sequelize.transaction();
  try {
    await dormLocationValidator(
      req.body,
      userData,
      dormitoryData,
      validRole,
      t,
      res
    );

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
