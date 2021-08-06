const express = require("express");
const multer = require("multer");
const path = require("path");
const requireAuth = require("../middlewares/requireAuth");
const dormImageController = require("../controller/dormImageController");

const dormImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/dormImage");
  },
  fieldname: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadDormImage = multer({
  storage: dormImageStorage,
}).single("dormImage");

const route = express.Router();

route.post(
  "/add-dormitory-image",
  [requireAuth, uploadDormImage],
  dormImageController.addDormImage
);

//To delte dormitory images
route.delete(
  "/delete-dormitory-image",
  requireAuth,
  dormImageController.deleteDormImage
);

module.exports = route;
