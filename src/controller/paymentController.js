const db = require("../../models");
const validator = require("../validator/validator");
const { findDormitoryData } = require("../database/find");
const { createPaymentValidator } = require("../validator/paymentValidator");

exports.createNewPayment = async (req, res) => {
  const { sender, recipientNumber, amount, referenceNumber, dormitoryId } =
    req.body;

  console.log(req.file);

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormitoryId);
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = createPaymentValidator(
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
