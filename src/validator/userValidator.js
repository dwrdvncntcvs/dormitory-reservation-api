exports.signUpValidator = (
  {
    name,
    username,
    email,
    plainPassword,
    plainConfirmPassword,
    contactNumber,
    address,
    gender,
    role,
  },
  transaction,
  res
) => {
  if (
    name === "" ||
    username === "" ||
    email === "" ||
    plainPassword === "" ||
    plainConfirmPassword === "" ||
    contactNumber === "" ||
    address === "" ||
    gender === "" ||
    role === ""
  ) {
    transaction.rollback();
    return res.status(401).send({ msg: "Invalid Inputs" });
  }
};

exports.passwordValidator = (password, t, res) => {
  if (!password) {
    t.rollback();
    return res.status(401).send({ msg: "Passwords not matched" });
  }
};

exports.signInValidator = ({ username, plainPassword, role }, user, res) => {
  if (username === "" || plainPassword === "" || role === "")
    return res.status(401).send({ msg: "Invalid Inputs" });

  if (!user)
    return res.status(401).send({ msg: "Invalid Username and Password" });

  if (user.isEmailVerified !== true)
    return res
      .status(401)
      .send({ msg: "Please Check your email to verify your account" });
};

exports.editAccountValidator = (toBeEdit, res, t) => {
  if (toBeEdit === "") {
    t.rollback();
    return res.status(401).send({ msg: "Invalid Inputs" });
  }
};

exports.is_roleValid = (validRole, res, t = null) => {
  if (t !== null) {
    if (validRole === false)
      return res.status(401).send({ msg: "Invalid User" });
  }
  if (validRole === false) return res.status(401).send({ msg: "Invalid User" });
};

exports.userValidator = (user, res, t = null) => {
  if (t !== null) {
    if (!user) {
      t.rollback();
      res.send({ msg: "Invalid User" });
    }
  }

  if (!user) {
    res.send({ msg: "Invalid User" });
  }
};
