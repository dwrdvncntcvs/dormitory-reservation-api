const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData } = require("../database/find");

exports.addRating = async (req, res) => {
  const { rating, dormId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);
  const validRole = validator.isValidRole(userData.role, "tenant");
  const isActive = await db.Reservation.findOne({
      where: { userId: userData.id, isActive: true}
  });

  const t = await db.sequelize.transaction();
  try {
    if (validRole === false) {
      console.log("Your role is ", userData.role);
      return res.status(401).send({
        msg: "Invalid User",
      });
    }

    if (!dormitoryData) {
        console.log(dormitoryData);
        return res.status(404).send({
            msg: "Dormitory not found"
        })
    }

    if (!isActive) {
        return res.status(404).send({
            msg: "Reservation not active"
        });
    }

    await db.DormRating.create({
        dormitoryId: dormitoryData.id,
        userId: userData.id,
        rating
    }, {
        transaction: t
    });
    await t.commit();

    return res.send({
        msg: "Rated Successfully"
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};
