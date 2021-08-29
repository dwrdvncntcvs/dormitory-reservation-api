const db = require("../../models");
const { findDormitoryData } = require("../database/find");

exports.addQuestion = async (req, res) => {
  const { question, dormitoryId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);

  const t = await db.sequelize.transaction();
  try {
    if (!dormitoryData) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    await db.Question.create(
      {
        question,
        questioner: userData.name,
        role: userData.role,
        dormitoryId: dormitoryData.id,
        userId: userData.id,
      },
      { transaction: t }
    );
    await t.commit();
    
    return res.send({
      msg: "Question added",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
