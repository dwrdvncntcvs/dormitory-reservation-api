const express = require("express");

const requireAuth = require("../middlewares/requireAuth");

const { UploadImage } = require("../middlewares/uploadImage");

const paymentController = require("../controller/paymentController");

const uploadPayment = new UploadImage("image/paymentImage", "paymentImage")
  .uploadImage;

const route = express.Router();

route.post(
  "/add-new-payment",
  [requireAuth, uploadPayment],
  paymentController.createNewPayment
);

route.put(
  "/verifiy-dormitory-payment",
  requireAuth,
  paymentController.verifyDormitoryPayment
);

route.delete(
  "/deny-dormitory-payment/dormtiory-:dormitoryId/payment-:paymentId/user-:userId",
  requireAuth,
  paymentController.denyDormitoryPayment
);

module.exports = route;
