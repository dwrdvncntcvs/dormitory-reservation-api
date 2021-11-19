require("dotenv/config");
const { S3 } = require("aws-sdk");

exports.s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

exports.getImageDetails = (file) => {
  let image = file.originalname.split(".");
  const imageType = image[image.length - 1];
  const imageName = file.fieldname + "-" + Date.now();
  const imageDetail = {
    imageName,
    imageType,
  };
  return imageDetail;
};

exports.createParams = (file, imageName, imageType) => {
  const imageBuffer = file.buffer;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${imageName}.${imageType}`,
    Body: imageBuffer,
  };
  return params;
};
