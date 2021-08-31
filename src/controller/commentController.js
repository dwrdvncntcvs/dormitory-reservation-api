const db = require("../../models");
const {
  findDormitoryData,
  findDormitoryQuestion,
  findDormitoryComment,
} = require("../database/find");

exports.addComment = async (req, res) => {
  const { comment, questionId, dormitoryId } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const questionData = await findDormitoryQuestion(questionId);

  const t = await db.sequelize.transaction();
  try {
    if (!dormitoryData) {
      await t.rollback();
      return res.status(404).send({ msg: "Dorm not found" });
    }

    if (!questionData) {
      await t.rollback();
      return res.status(404).send({ msg: "Question not found" });
    }

    if (questionData.dormitoryId !== dormitoryData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Question not found" });
    }

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

  try {
    if (comment === "") {
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

    if (!commentData) {
      await t.rollback();
      return res.status(404).send({ msg: "Comment not found" });
    }

    if (commentData.dormitoryId !== dormitoryData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Comment not found" });
    }

    if (commentData.questionId !== questionData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Comment not found" });
    }

    if (commentData.userId !== userData.id) {
      await t.rollback();
      return res.status(404).send({ msg: "Comment not found" });
    }

    await db.Comment.update(
      { comment },
      {
        where: {
          id: commentData.id,
          userId: userData.id,
          questionId: questionData.id,
          dormitoryId: dormitoryData.id,
        }
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
