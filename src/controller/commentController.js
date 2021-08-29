// const db = require("../../models");
// const {
//   findDormitoryData,
//   findDormitoryQuestion,
// } = require("../database/find");

// exports.addComment = async (req, res) => {
//   const { comment, questionId, dormitoryId } = req.body;

//   const userData = req.user;
//   const dormitoryData = await findDormitoryData(dormitoryId);
//   const questionData = await findDormitoryQuestion(questionId);

//   const t = await db.sequelize.transaction();
//   try {
//     if (!dormitoryData) {
//       await t.rollback();
//       return res.status(404).send({ msg: "Dorm not found" });
//     }

//     if (!questionData) {
//       await t.rollback();
//       return res.status(404).send({ msg: "Question not found" });
//     }

//     if (questionData.dormitoryId !== dormitoryData.id) {
//       await t.rollback();
//       return res.status(404).send({ msg: "Question not found" });
//     }

//     await db.Comment.create({
//         comment,
//         commenter: userData.name,
//         questionId: questionData.id,
//         dormitoryId: dormitoryData.id,
//         userId: userData.id,
//     });

//     return res.send({ msg: "Comment Added" });
//   } catch (err) {
//     console.log(err);
//     await t.rollback();
//     return res.status(500).send({ msg: "Something went wrong" });
//   }
// };
