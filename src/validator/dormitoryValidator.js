exports.createNewDormitoryValidator = (
  { name, address, contactNumber, allowedGender },
  userData,
  validRole,
  t,
  res
) => {
  //Check the user role
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  //Check if the user is verified
  if (userData.isVerified !== true) {
    t.rollback();
    return res.status(401).send({ msg: "Account not verified" });
  }

  //Check the field if not empty
  if (
    name === "" ||
    address === "" ||
    contactNumber === "" ||
    allowedGender === ""
  ) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid Value" });
  }
};

exports.deleteDormitoryValidator = (
  userData,
  dormitoryData,
  validRole,
  t,
  res
) => {
  //Check the role of the user
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "You are not an owner" });
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

exports.dormitorySwitchValidator = (
  userData,
  dormitoryData,
  validRole,
  t,
  res
) => {
  //Check the role of the userData
  if (validRole === false) {
    t.rollback();
    return res.status(401).send({ msg: "Invalid User" });
  }

  //Check if the dormitory does exist in the database
  if (!dormitoryData) {
    t.rollback();
    return res.status(404).send({ msg: "Dormitory not found" });
  }

  //Check if the dormitory is owned by the user
  if (dormitoryData.userId !== userData.id) {
    t.rollback();
    return res.status(401).send({ msg: "Dormitory not found" });
  }

  if (dormitoryData.isVerified === false) {
    t.rollback();
    return res.status(401).send({ msg: "Dormitory not verified" });
  }
};
