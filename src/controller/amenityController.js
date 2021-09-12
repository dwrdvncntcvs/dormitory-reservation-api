const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData } = require("../database/find");
const { validateAmenity } = require("../validator/amenityValidator");

exports.addAmenities = async (req, res) => {
  const { dormId, amenity } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = validateAmenity(amenity, validRole, dormitoryData, userData);
  if (validationResult !== null) {
    res.status(validationResult.statusCode).send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.Amenity.create(
      { name: amenity, dormitoryId: dormId },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Amenity Successfully Added" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
