const db = require("../../models");
const {
  findDormitoryData,
  findDormitoryQuestion,
} = require("../database/find");

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

exports.editQuestion = async (req, res) => {
  const { question, questionId, dormitoryId } = req.body;

  const userData = req.user;
  const questionData = await findDormitoryQuestion(questionId);
  const dormitoryData = await findDormitoryData(dormitoryId);

  const t = await db.sequelize.transaction();
  try {
    if (question === "") {
      await t.rollback();
      return res.status(401).send({ msg: "Invalid Input" });
    }

    if (!dormitoryData) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    if (!questionData) {
      await t.rollback();
      return res.status(404).send({ msg: "Question not found" });
    }

    if (questionData.dormitoryId !== dormitoryData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Question not found" });
    }

    if (questionData.userId !== userData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Question not found" });
    }

    await db.Question.update(
      {
        question,
      },
      {
        where: {
          id: questionData.id,
          dormitoryId: dormitoryData.id,
          userId: userData.id,
        },
      },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Question Edited" });
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.removeQuestion = async (req, res) => {
  const { questionId, dormitoryId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const questionData = await findDormitoryQuestion(questionId);

  const t = await db.sequelize.transaction();
  try {
    if (!dormitoryData) {
      await t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    if (!questionData) {
      await t.rollback();
      return res.status(404).send({ msg: "Question not found" });
    }

    if (questionData.dormitoryId !== dormitoryData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Question not found" });
    }

    if (questionData.userId !== userData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Question not found" });
    }

    await db.Question.destroy(
      {
        where: {
          id: questionData.id,
          dormitoryId: dormitoryData.id,
          userId: userData.id,
        },
      },
      { transaction: t }
    );
    await t.commit();
    return res.send({ msg: "Question Deleted" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
