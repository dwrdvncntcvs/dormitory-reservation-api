const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const validator = require("../validator/validator");
const fs = require("fs");

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

  const t = await db.sequelize.transaction();
  try {
    if (
      name === null &&
      username === null &&
      email === null &&
      plainPassword === null &&
      plainConfirmPassword === null &&
      contactNumber === null &&
      address === null &&
      gender === null &&
      role === null
    ) {
      return res.status(401).send({ msg: "Can't submit empty field" });
    }

    const salt = await bcrypt.genSalt(10, "a");
    const password = await bcrypt.hash(plainPassword, salt);

    const verifyPassword = await bcrypt.compare(plainConfirmPassword, password);

    if (!verifyPassword) {
      return res.status(401).send({
        msg: "Passwords are not the same.",
      });
    }

    await db.User.create(
      {
        name,
        username,
        email,
        password,
        contactNumber,
        address,
        gender,
        role,
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      msg: "Successfully Created!",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
      err,
    });
  }
};

//SIGN IN WITH EXISTING INFORMATION
exports.signIn = async (req, res) => {
  const { username, plainPassword, role } = req.body;

  try {
    if (username === null && plainPassword === null && role === null) {
      return res.status(401).send({
        msg: "Can't submit empty fields",
      });
    }

    const user = await db.User.findOne({
      where: { username, role },
    });

    if (!user) {
      return res.status(401).send({
        msg: "Invalid Username and Password",
      });
    }

    const validatedPassword = await bcrypt.compare(
      plainPassword,
      user.password
    );

    if (!validatedPassword) {
      return res.status(401).send({
        msg: "Invalid Username and Password",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      config.secretKey
    );

    return res.send({
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: "Something went wrong",
      err,
    });
  }
};

//This needs the user to be authenticated before the user view his/her profile details
//This is not only for showing user information but also their dormitories and some images
exports.userProfile = async (req, res) => {
  try {
    const userData = req.user;

    if (userData.role === "owner") {
      const user = await db.User.findOne({
        where: { id: userData.id },
        include: [db.Document, db.ProfileImage, db.Dormitory],
      });

      return res.send({
        user,
      });
    } else if (userData.role === "tenant") {
      // To be fixed soon hehe :)
      const user = await db.User.findOne({
        where: { id: userData.id },
        include: [db.Document, db.ProfileImage]
      });

      return res.send({
        user,
      });
    } else if (userData.role === "admin") {
      const user = await db.User.findOne({
        where: { id: userData.id },
        include: [db.ProfileImage, db.Document],
      });

      return res.send({
        user,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//EDIT USER INFORMATION
//EDIT ONLY NAME
exports.editProfileName = async (req, res) => {
  const { name } = req.body;

  const t = await db.sequelize.transaction();
  const userData = req.user;
  try {
    await db.User.update(
      {
        name,
      },
      {
        where: { id: userData.id },
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      msg: "Name successfully updated",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//EDIT ONLY USERNAME
exports.editProfileUsername = async (req, res) => {
  const { username } = req.body;

  const t = await db.sequelize.transaction();
  const userData = req.user;
  try {
    const user = await db.User.count({
      where: { username },
    });

    if (user !== 0) {
      return res.status(401).send({ msg: "Error 1" }); // To be changed soon
    }

    await db.User.update(
      {
        //To be edited
        username,
      },
      {
        //Finding what to edit
        where: { id: userData.id },
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      msg: "Username successfully updated",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//EDIT ONLY ADDRESS
exports.editProfileAddress = async (req, res) => {
  const { address } = req.body;

  const userData = req.user;
  const t = await db.sequelize.transaction();
  try {
    await db.User.update(
      {
        address,
      },
      {
        where: { id: userData.id },
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      msg: "Address updated successfully",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//Checks email address to change user's password.
exports.checkUserEmail = async (req, res) => {
  const email = req.params.email;

  try {
    const user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).send({
        msg: "Invalid Email Address", // To be changed soon.
      });
    }

    return res.send({
      id: user.id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

//Checks the uuid of the user to let them change their password.
exports.changeUserPassword = async (req, res) => {
  const { id, plainPassword, plainConfirmPassword } = req.body;

  const t = await db.sequelize.transaction();
  try {
    //Checking if fields are null or not.
    if (plainPassword === null && plainConfirmPassword === null) {
      return res.status(401).send({
        msg: "Error 1", // To be change soon.
      });
    }

    //For salting and hashing password
    const salt = await bcrypt.genSalt(10, "a");
    const password = await bcrypt.hash(plainPassword, salt);

    const verifiedPassword = await bcrypt.compare(
      plainConfirmPassword,
      password
    );
    console.log("Password to be saved: ", password);

    if (!verifiedPassword) {
      return res.status(401).send({
        msg: "Error 2", // To be change soon.
      });
    }

    await db.User.update(
      {
        password,
      },
      {
        where: { id },
      },
      {
        transaction: t,
      }
    );
    await t.commit();

    return res.send({
      msg: "Password Successfully Changed",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};
