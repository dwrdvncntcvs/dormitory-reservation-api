const db = require("../../models");
const validator = require("../validator/validator");
const {
  findDormitoryData,
  findPaymentData,
  findUserData,
  findPaymentRefData,
  countNotValidPayment,
  findDormitoryPaymentData,
} = require("../database/find");
const {
  createPaymentValidator,
  paymentVerification,
  denyDormitoryPaymentValidator,
} = require("../validator/paymentValidator");
const {
  paymentVerificationNotice,
  deniedPaymentNotice,
} = require("../mailer/mailer");
const { s3, createParams, getImageDetails } = require("../aws/s3");

exports.createNewPayment = async (req, res) => {
  const { sender, recipientNumber, amount, referenceNumber, dormitoryId } =
    req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const validRole = validator.isValidRole(userData.role, "owner");
  const dormitoryPaymentData = await findDormitoryPaymentData(dormitoryId);
  const paymentData = await findPaymentRefData(referenceNumber);
  const notValidPayment = await countNotValidPayment(dormitoryId);
  const isRefExist = validator.isRefNumberExist(paymentData);
  console.log(notValidPayment);

  const validationResult = createPaymentValidator(
    dormitoryPaymentData,
    notValidPayment,
    isRefExist,
    validRole,
    userData,
    dormitoryData,
    req.body
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    const file = req.file;
    const { imageName, imageType } = getImageDetails(file);
    const params = createParams(file, imageName, imageType);

    s3.upload(params, async (err, data) => {
      if (err) {
        res.status(500).send(err);
      }

      await db.Payment.create(
        {
          sender,
          recipientNumber,
          amount,
          referenceNumber,
          filename: imageName + imageType,
          filepath: data.Location,
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
    });
  } catch (err) {
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
    await db.Dormitory.update(
      { isPayed: true },
      { where: { id: dormitoryData.id } },
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

exports.denyDormitoryPayment = async (req, res) => {
  const userId = req.params.userId;
  const dormitoryId = req.params.dormitoryId;
  const paymentId = req.params.paymentId;

  const userData = req.user;
  const userToBeMailed = await findUserData(userId);
  const dormitoryData = await findDormitoryData(dormitoryId);
  const paymentData = await findPaymentData(paymentId);
  const validRole = validator.isValidRole(userData.role, "admin");

  const validationResult = denyDormitoryPaymentValidator(
    userToBeMailed,
    dormitoryData,
    paymentData,
    validRole
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.Payment.destroy(
      { where: { id: paymentData.id } },
      { transaction: t }
    );
    await t.commit();

    deniedPaymentNotice(userToBeMailed);

    return res.send({ msg: "Dormitory Payment Denied" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
