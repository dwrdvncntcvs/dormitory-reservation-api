const express = require("express");
const multer = require("multer");
const path = require("path");

//Requiring Authentication Middleware
const requireAuth = require("../middlewares/requireAuth");

//Requiring Dormitory Image Controller
const dormImageController = require("../controller/dormImageController");

//Initializing Multer Dormitory Image Engine
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

//Middleware to upload Dormitory Images
const uploadDormImage = multer({
  storage: dormImageStorage,
}).single("dormImage");

const route = express.Router();

//To create and add new dormitory image
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
