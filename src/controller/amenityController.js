const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData } = require("../database/find");
const { addAmenityValidator, validateAmenity } = require("../validator/amenityValidator");

//To add or create new amenity for the dormitory
exports.addAmenities = async (req, res) => {
  const { dormId, amenity } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "owner");

  // new validation approach
  const validationResult = validateAmenity(amenity, validRole, dormitoryData, userData);
  if (validationResult !== null) {
    res.status(validationResult.statusCode).send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    // await addAmenityValidator(
    //   amenity,
    //   validRole,
    //   dormitoryData,
    //   userData,
    //   res,
    //   t
    // );

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
