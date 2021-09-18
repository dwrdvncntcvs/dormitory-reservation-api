const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData, findAmenity } = require("../database/find");
const {
  validateAmenity,
  removeAmenityValidator,
} = require("../validator/amenityValidator");

exports.addAmenities = async (req, res) => {
  const { dormId, amenity } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = validateAmenity(
    amenity,
    validRole,
    dormitoryData,
    userData
  );
  if (validationResult !== null) {
    res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
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

exports.removeAmenities = async (req, res) => {
  const dormId = req.params.dormId;
  const amenityId = req.params.amenityId;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const amenityData = await findAmenity(amenityId);
  const validRole = validator.isValidRole(userData.role, "owner");

  console.log("AMENITY: ", amenityData);

  const validationResult = removeAmenityValidator(
    validRole,
    amenityData,
    dormitoryData,
    userData
  );

  console.log("Validation Result: ", validationResult);
  if (validationResult !== null) {
    res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.Amenity.destroy(
      { where: { id: amenityData.id } },
      { transaction: t }
    );
    await t.commit();

    return res.status(200).send({ msg: "Amenity deleted successfully" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
