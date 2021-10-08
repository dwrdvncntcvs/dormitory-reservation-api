const express = require("express");
const multer = require("multer");
const path = require("path");

const requireAuth = require("../middlewares/requireAuth");

const paymentController = require("../controller/paymentController");

const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/paymentImage");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadPayment = multer({ storage: paymentStorage }).single(
  "paymentImage"
);

const route = express.Router();

route.post(
  "/add-new-payment",
  [requireAuth, uploadPayment],
  paymentController.createNewPayment
);

module.exports = route;
