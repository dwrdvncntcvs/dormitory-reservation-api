exports.addRatingValidator = (
  { rating },
  dormitoryData,
  validRole,
  isActive,
  t,
  res
) => {
  if (rating === "") {
    t.rollback();
    return res.status(401).send({ msg: "Invalid Input" });
  }

  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (!isActive) {
    t.rollback();
    return res.status(404).send({ msg: "Reservation not active" });
  }
};

exports.removeRatingValidator = (
  userData,
  dormitoryData,
  ratingData,
  validRole,
  t,
  res
) => {
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (!ratingData) {
    t.rollback();
    return res.status(404).send({ msg: "Rating not found" });
  }

  if (ratingData.dormitoryId !== dormitoryData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Rating not found" });
  }

  if (ratingData.userId !== userData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Rating not found" });
  }
};
