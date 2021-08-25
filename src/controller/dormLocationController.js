const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData } = require("../database/find");

exports.addDormitoryLocation = async (req, res) => {
  const { dormId, longitude, latitude } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const point = { type: "Point", coordinates: [ latitude, longitude ] };

  const t = await db.sequelize.transaction();
  try {
    if (longitude === "" || latitude === "") {
      await t.rollback();
      return res.status(401).send({ msg: "Invalid Inputs" });
    }

    if (validRole === false) {
      await t.rollback();
      return res.status(401).send({ msg: "Invalid User" });
    }

    if (!dormitoryData) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    if (dormitoryData.userId !== userData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

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
