const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const { UploadImage } = require("../middlewares/uploadImage");

const dormImageController = require("../controller/dormImageController");

const uploadDormImage = new UploadImage("''", "dormImage")
  .uploadImage;

const route = express.Router();

route.post(
  "/add-dormitory-image",
  [requireAuth, uploadDormImage],
  dormImageController.addDormImage
);

route.delete(
  "/delete-dormitory-image/dorm-:dormId/image-:imageId",
  requireAuth,
  dormImageController.deleteDormImage
);

module.exports = route;
