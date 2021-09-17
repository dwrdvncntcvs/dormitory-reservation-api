const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const validator = require("../validator/validator");
const fs = require("fs");
const mailer = require("../mailer/mailer");
const {
  signUpValidator,
  passwordValidator,
  signInValidator,
  editAccountValidator,
} = require("../validator/userValidator");

//CREATE NEW INFORMATION
exports.signUp = async (req, res) => {
  const {
    name,
    username,
    email,
    plainPassword,
    plainConfirmPassword,
    contactNumber,
    address,
    gender,
    role,
  } = req.body;

  const validationResult = signUpValidator(req.body);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const salt = await bcrypt.genSalt(10, "a");
  const password = await bcrypt.hash(plainPassword, salt);

  const verifyPassword = await bcrypt.compare(plainConfirmPassword, password);

  const validatePassword = passwordValidator(verifyPassword);
  if (validatePassword !== null) {
    return res
      .status(validatePassword.statusCode)
      .send({ msg: validatePassword.message });
  }

  const t = await db.sequelize.transaction();
  try {
    const user = await db.User.create(
      { name, username, email, password, contactNumber, address, gender, role },
      { transaction: t }
    );
    await t.commit();
    mailer.verifyEmail(user, req.headers.host);

    return res.send({ msg: "Successfully Created!" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//SIGN IN WITH EXISTING INFORMATION
exports.signIn = async (req, res) => {
  const { username, plainPassword, role } = req.body;

  const user = await db.User.findOne({
    where: { username, role },
  });

  const validationResult = signInValidator(req.body, user);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const validatedPassword = await bcrypt.compare(plainPassword, user.password);

  if (!validatedPassword)
    return res.status(401).send({ msg: "Invalid Username and Password" });

  try {
    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      config.secretKey
    );

    return res.send({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.verifyEmail = async (req, res) => {
  const id = req.params.id;
  const userData = await db.User.findOne({ where: { id } });

  if (!userData) {
    return res.status(404).send({ msg: "User not found" });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.User.update(
      { isEmailVerified: true },
      { where: { id } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Email Verified" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//This needs the user to be authenticated before the user view his/her profile details
//This is not only for showing user information but also their dormitories and some images
exports.userProfile = async (req, res) => {
  const userData = req.user;
  try {
    if (userData.role === "owner") {
      const user = await db.User.findOne({
        where: { id: userData.id },
        include: [db.Document, db.ProfileImage, db.Dormitory],
      });

      return res.send({ user });
    } else if (userData.role === "tenant") {
      const user = await db.User.findOne({
        where: { id: userData.id },
        include: [db.Document, db.ProfileImage],
      });

      return res.send({ user });
    } else if (userData.role === "admin") {
      const user = await db.User.findOne({
        where: { id: userData.id },
        include: [db.ProfileImage],
      });

      return res.send({ user });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//EDIT USER INFORMATION
//EDIT ONLY NAME
exports.editProfileName = async (req, res) => {
  const { name } = req.body;

  const validationResult = editAccountValidator(name);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  const userData = req.user;
  try {
    await db.User.update(
      { name },
      { where: { id: userData.id } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Name successfully updated" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//EDIT ONLY USERNAME
exports.editProfileUsername = async (req, res) => {
  const { username } = req.body;

  const validationResult = editAccountValidator(username);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  const userData = req.user;
  try {
    await db.User.update(
      { username },
      { where: { id: userData.id } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Username successfully updated" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//EDIT ONLY ADDRESS
exports.editProfileAddress = async (req, res) => {
  const { address } = req.body;

  const validationResult = editAccountValidator(address);
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const userData = req.user;
  const t = await db.sequelize.transaction();
  try {
    await db.User.update(
      { address },
      { where: { id: userData.id } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Address updated successfully" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//Checks email address to change user's password.
exports.checkUserEmail = async (req, res) => {
  const email = req.params.email;
  const { hostAddress } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user) return res.status(401).send({ msg: "Invalid Email Address" });

    mailer.changePassword(user, hostAddress,);

    return res.status(200).send({ msg: "Please open your email to fully change your password." });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

//Checks the uuid of the user to let them change their password.
exports.changeUserPassword = async (req, res) => {
  const { id, plainPassword, plainConfirmPassword } = req.body;

  //Checking if fields are null or not.
  if (plainPassword === "" || plainConfirmPassword === "") {
    return res.status(401).send({ msg: "Invalid Passwords" });
  }

  //For salting and hashing password
  const salt = await bcrypt.genSalt(10, "a");
  const password = await bcrypt.hash(plainPassword, salt);

  const verifiedPassword = await bcrypt.compare(plainConfirmPassword, password);

  const validatePassword = passwordValidator(verifiedPassword);
  if (validatePassword !== null) {
    return res
      .status(validatePassword.statusCode)
      .send({ msg: validatePassword.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.User.update({ password }, { where: { id } }, { transaction: t });
    await t.commit();

    return res.send({ msg: "Password Successfully Changed" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
