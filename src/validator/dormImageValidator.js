exports.is_roleValid = (validRole, t, res) => {
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ message: "Invalid User" });
  }
};

exports.dormImageValidator = (
  name = null,
  userData,
  dormitoryData,
  dormImageData = null,
  t,
  res
) => {
  if (name !== null) {
    if (name === "") {
      t.rollback();
      return res.status(404).send({ msg: "Invalid Input" });
    }

    if (!dormitoryData) {
      t.rollback();
      return res.status(404).send({ message: "Dormitory not found" });
    }

    //Check if the dormitory was owned by the owner user
    if (userData.id !== dormitoryData.userId) {
      t.rollback();
      return res.status(404).send({ message: "Dormitory not found" });
    }
  }

  if (name === null) {
    if (!dormitoryData) {
      t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    if (!dormImageData) {
      t.rollback();
      return res.status(404).send({ msg: "Dormitory Image not found" });
    }

    if (dormitoryData.userId !== userData.id) {
      t.rollback();
      return res.status(404).send({ msg: "Dormitory not found" });
    }

    if (dormitoryData.id !== dormImageData.dormitoryId) {
      t.rollback();
      return res.status(404).send({ msg: "Dormitory Image not found" });
    }
  }
};

exports.dormProfileImageValidator = (userData, dormitoryData, t, res) => {
  //Check if the dormitoryData exist
  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  if (dormitoryData.userId !== userData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }
};

exports.dormDocumentValidator = (
  name,
  type,
  userData,
  dormitoryData,
  t,
  res
) => {
  if (name === "" || type === "") {
    t.rollback();
    return res.status(404).send({ msg: "Invalid Input" });
  }

  //Check if dormitory does exist
  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  //Check if the dormitory exists owned by the right owner
  if (dormitoryData.userId !== userData.id) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }
};
