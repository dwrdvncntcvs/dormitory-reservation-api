exports.addAmenityValidator = (
  amenity,
  validRole,
  dormitoryData,
  userData,
  res,
  t
) => {
  if (amenity === "") {
    t.rollback();
    return res.status(404).send({ msg: "Invalid Input" });
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
    return res.status(401).send({ msg: "Dormitory not found" });
  }
};
