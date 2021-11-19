const multer = require("multer");
const path = require("path");

class UploadImage {
  constructor(imagePath, imageName) {
    const image = imagePath;
    const name = imageName;

    const storage = this.imageStorage(image);
    this.uploadImage = multer({ storage }).single(name);
  }

  imageStorage(imagePath) {
    const multerStorage = multer.memoryStorage({
      destination: (req, file, cb) => {
        cb(null, imagePath);
      },
    });

    return multerStorage;
  }
}

module.exports.UploadImage = UploadImage;
