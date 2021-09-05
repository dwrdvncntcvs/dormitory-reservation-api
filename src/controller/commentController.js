const db = require("../../models");
const {
  findDormitoryData,
  findDormitoryQuestion,
  findDormitoryComment,
} = require("../database/find");
const { commentValidator } = require("../validator/commentValidator");

exports.addComment = async (req, res) => {
  const { comment, questionId, dormitoryId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const questionData = await findDormitoryQuestion(questionId);

  const t = await db.sequelize.transaction();
  try {
    await commentValidator(
      comment,
      userData,
      dormitoryData,
      questionData,
      null,
      res,
      t
    );

    await db.Comment.create({
      comment,
      commenter: userData.name,
      role: userData.role,
      questionId: questionData.id,
      dormitoryId: dormitoryData.id,
      userId: userData.id,
    });

    return res.send({ msg: "Comment Added" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.editComment = async (req, res) => {
  const { comment, questionId, commentId, dormitoryId } = req.body;

  const userData = req.user;
  const questionData = await findDormitoryQuestion(questionId);
  const commentData = await findDormitoryComment(commentId);
  const dormitoryData = await findDormitoryData(dormitoryId);

  const t = await db.sequelize.transaction();
P
  try {
    await commentValidator(
      comment,
      userData,
      dormitoryData,
      questionData,
      commentData,
      res,
      t
    );

    await db.Comment.update(
      { comment },
      {
        where: {
          id: commentData.id,
          userId: userData.id,
          questionId: questionData.id,
          dormitoryId: dormitoryData.id,
        },
      },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Comment Edited" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.removeComment = async (req, res) => {
  const { commentId, questionId, dormitoryId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const questionData = await findDormitoryQuestion(questionId);
  const commentData = await findDormitoryComment(commentId);

  const t = await db.sequelize.transaction();
  try {
    await commentValidator(
      null,
      userData,
      dormitoryData,
      questionData,
      commentData,
      res,
      t
    );

    await db.Comment.destroy(
      {
        where: {
          id: commentData.id,
          questionId: questionData.id,
          dormitoryId: dormitoryData.id,
          userId: userData.id,
        },
      },
      { transaction: t }
    );

    return res.send({ msg: "Comment Deleted" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
