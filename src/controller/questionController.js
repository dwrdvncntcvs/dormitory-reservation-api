const db = require("../../models");
const {
  findDormitoryData,
  findDormitoryQuestion,
} = require("../database/find");
const {
  addQuestionValidator,
  editQuestionValidator,
  removeQuestionValidator,
} = require("../validator/questionValidator");

exports.addQuestion = async (req, res) => {
  const { question, dormitoryId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);

  const validationResult = addQuestionValidator(question, dormitoryData);
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
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

  const validationResult = editQuestionValidator(
    question,
    userData,
    questionData,
    dormitoryData
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msgs: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
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

  const validationResult = removeQuestionValidator(
    userData,
    questionData,
    dormitoryData
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
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
