exports.addQuestionValidator = (question, dormitoryData, t, res) => {
  if (question === "") {
    t.rollback();
    return res.status(401).send({ msg: "Invalid Input" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }
};

exports.editQuestionValidator = (
  question,
  userData,
  questionData,
  dormitoryData,
  t,
  res
) => {
  if (question === "") {
    t.rollback();
    return res.status(401).send({ msg: "Invalid Input" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (!questionData) {
    t.rollback();
    return res.status(404).send({ msg: "Question not found" });
  }

  if (questionData.dormitoryId !== dormitoryData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Question not found" });
  }

  if (questionData.userId !== userData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Question not found" });
  }
};

exports.removeQuestionValidator = (userData, questionData, dormitoryData, t, res) => {
  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (!questionData) {
    t.rollback();
    return res.status(404).send({ msg: "Question not found" });
  }

  if (questionData.dormitoryId !== dormitoryData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Question not found" });
  }

  if (questionData.userId !== userData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Question not found" });
  }
};
