//Imports Here
const express = require("express");
const multer = require("multer");
const path = require("path");
const requireAuth = require("../middlewares/requireAuth");

//Engine for dorm documents storage
const dormDocumentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/dormDocumentImage");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
//Engine for dormitory profile image
const dormProfileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/dormitoryProfileImage");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//To upload dormitory profile image
const uploadDormProfileImage = multer({
  storage: dormProfileImageStorage,
}).single("dormProfileImage");

const uploadDormDocument = multer({
  storage: dormDocumentStorage,
}).single("dormDocument");

//Import Dormitory Controller || Functions
const dormitoryController = require("../controller/dormitoryController");
const dormImageController = require("../controller/dormImageController");
const adminUserController = require("../controller/adminUserController");

const route = express.Router();

//Endpoints Here
//To create new dormitory
route.post(
  "/create-new-dormitory",
  requireAuth,
  dormitoryController.createNewDormitory
);

//To add profile image of a dormitory
route.post(
  "/add-dormitory-profile-image",
  [requireAuth, uploadDormProfileImage],
  dormImageController.addDormitoryProfileImage
);

//To add Dormitory Documents that will verify by the adminUsers
route.post(
  "/add-dormitory-documents",
  [requireAuth, uploadDormDocument],
  dormImageController.addDormitoryDocuments
);

route.get(
  "/view-owner-dormitories",
  requireAuth,
  dormitoryController.displayOwnerDormitories
);

route.get(
  "/get-dormitory-by-reservation/reservation-:reservationId",
  requireAuth,
  dormitoryController.getDormitoriesByUserReservation
);

//To get specific dormitory information created by the user.
route.get(
  "/view-dormitory-detail/:dormId",
  dormitoryController.viewDormitoryDetail
);

route.get("/search-dormitory", dormitoryController.searchDormitory);

//To get or display all dormitory information
route.get("/get-all-dormitories", dormitoryController.displayAllDormitories);

route.get(
  "/get-all-dormitories/admin/dormitory-:filter",
  requireAuth,
  adminUserController.displayAllDormitories
);

route.get(
  "/get-dormitory-detail/admin/dormitory-:dormitoryId",
  requireAuth,
  adminUserController.displayDormitoryDetail
);

//To edit the status of the availability of the dormitory
route.put(
  "/dormitory-switch",
  requireAuth,
  dormitoryController.dormitorySwitch
);

//To delete dormitory information
route.delete(
  "/delete-dormitory/dormitory-:id",
  requireAuth,
  dormitoryController.deleteDormitory
);

route.delete(
  "/delete-dormitory-profile-image/dorm-:dormId/image-:profileImageId",
  requireAuth,
  dormImageController.removeDormitoryProfileImage
);

//Export Here
module.exports = route;
