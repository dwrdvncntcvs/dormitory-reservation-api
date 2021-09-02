exports.commentValidator = (
  comment = null,
  userData,
  dormitoryData,
  questionData,
  commentData = null,
  res,
  t
) => {
  if (commentData === null) {
    if (comment === "") {
      t.rollback();
      return res.status(401).send({ msg: "Invalid Input" });
    }

    if (!dormitoryData) {
      t.rollback();
      return res.status(404).send({ msg: "Dorm not found" });
    }

    if (!questionData) {
      t.rollback();
      return res.status(404).send({ msg: "Question not found" });
    }

    if (questionData.dormitoryId !== dormitoryData.id) {
      t.rollback();
      return res.status(404).send({ msg: "Question not found" });
    }
  }

  if (comment === null) {    
      if (!dormitoryData) {
        t.rollback();
        return res.status(404).send({ msg: "Dormitory not found" });
      }
    
      if (!questionData) {
        t.rollback();
        return res.status(404).send({ msg: "Question not found" });
      }
    
      if (!commentData) {
        t.rollback();
        return res.status(404).send({ msg: "Comment not found" });
      }
    
      if (commentData.dormitoryId !== dormitoryData.id) {
        t.rollback();
        return res.status(404).send({ msg: "Comment not found" });
      }
    
      if (commentData.questionId !== questionData.id) {
        t.rollback();
        return res.status(404).send({ msg: "Comment not found" });
      }
    
      if (commentData.userId !== userData.id) {
        t.rollback();
        return res.status(404).send({ msg: "Comment not found" });
      }
  }

  if (comment === "") {
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

  if (!commentData) {
    t.rollback();
    return res.status(404).send({ msg: "Comment not found" });
  }

  if (commentData.dormitoryId !== dormitoryData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Comment not found" });
  }

  if (commentData.questionId !== questionData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Comment not found" });
  }

  if (commentData.userId !== userData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Comment not found" });
  }
};
