const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData, findDormRatingData } = require("../database/find");
const {
  addRatingValidator,
  removeRatingValidator,
} = require("../validator/dormRatingValidator");

exports.addRating = async (req, res) => {
  const { rating, dormId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "tenant");
  const isActive = await db.Reservation.findOne({
    where: { userId: userData.id, isActive: true },
  });

  const t = await db.sequelize.transaction();
  try {
    await addRatingValidator(
      req.body,
      dormitoryData,
      validRole,
      isActive,
      t,
      res
    );

    await db.DormRating.create(
      {
        dormitoryId: dormitoryData.id,
        userId: userData.id,
        rating,
      },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Rated Successfully" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.removeRating = async (req, res) => {
  const { ratingId, dormId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const ratingData = await findDormRatingData(ratingId);
  const validRole = validator.isValidRole(userData.role, "tenant");

  const t = await db.sequelize.transaction();
  try {
    await removeRatingValidator(
      userData,
      dormitoryData,
      ratingData,
      validRole,
      t,
      res
    );

    await db.DormRating.destroy(
      { where: { id: ratingId } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Rating removed" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
