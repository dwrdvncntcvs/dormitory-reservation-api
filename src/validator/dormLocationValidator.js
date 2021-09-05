exports.dormLocationValidator = (
  { longitude, latitude },
  userData,
  dormitoryData,
  validRole,
  t,
  res
) => {
  if (longitude === "" || latitude === "") {
    t.rollback();
    return res.status(401).send({ msg: "Invalid Inputs" });
  }

  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (dormitoryData.userId !== userData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }
};
