const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData, findDormRatingData } = require("../database/find");

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
    if (validRole === false) {
      await t.rollback();
      return res.status(401).send({ msg: "Invalid User" });
    }

    if (!dormitoryData) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    if (!isActive) {
      await t.rollback();
      return res.status(404).send({ msg: "Reservation not active" });
    }

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
    if (validRole === false) {
      await t.rollback();
      return res.status(401).send({ msg: "Invalid User" });
    }

    if (!dormitoryData) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    if (!ratingData) {
      await t.rollback();
      return res.status(404).send({ msg: "Rating not found" });
    }

    if (ratingData.dormitoryId !== dormitoryData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Rating not found" });
    }

    if (ratingData.userId !== userData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Rating not found" });
    }

    await db.DormRating.destroy(
      { where: { id: ratingId } },
      { transaction: t }
    );
    await t.commit();

    return res.send({msg: "Rating removed"})
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
