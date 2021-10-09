const db = require("../../models");
const validator = require("../validator/validator");
const {
  findDormitoryData,
  findPaymentData,
  findUserData,
} = require("../database/find");
const {
  createPaymentValidator,
  paymentVerification,
} = require("../validator/paymentValidator");
const { paymentVerificationNotice } = require("../mailer/mailer");
const fs = require("fs");

exports.createNewPayment = async (req, res) => {
  const { sender, recipientNumber, amount, referenceNumber, dormitoryId } =
    req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const validRole = validator.isValidRole(userData.role, "owner");
  const file = `image/paymentImage/${req.file.filename}`;

  const validationResult = createPaymentValidator(
    validRole,
    userData,
    dormitoryData,
    req.body
  );
  if (validationResult !== null) {
    await fs.unlink(file, (err) => {
      console.log(err);
    });
    
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.Payment.create(
      {
        sender,
        recipientNumber,
        amount,
        referenceNumber,
        filename: req.file.filename,
        filepath: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        dormitoryId: dormitoryData.id,
        userId: userData.id,
      },
      { transaction: t }
    );
    await t.commit();

    return res.send({
      msg: "Payment Successfully Created. Please wait for the verification of the admin",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.verifyDormitoryPayment = async (req, res) => {
  const { userId, dormitoryId, paymentId } = req.body;

  const userData = req.user;
  const userToBeMailed = await findUserData(userId);
  const dormitoryData = await findDormitoryData(dormitoryId);
  const validRole = validator.isValidRole(userData.role, "admin");
  const paymentData = await findPaymentData(paymentId);

  const validationResult = paymentVerification(
    validRole,
    dormitoryData,
    paymentData,
    userToBeMailed
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.Payment.update(
      { isValid: true },
      { where: { id: paymentData.id, isValid: false } },
      { transaction: t }
    );
    await t.commit();

    paymentVerificationNotice(userToBeMailed);

    return res.send({ msg: "Payment Accepted" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
