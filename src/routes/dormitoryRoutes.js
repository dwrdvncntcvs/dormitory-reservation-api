const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const { UploadImage } = require("../middlewares/uploadImage");

const uploadDormProfileImage = new UploadImage(
  "image/dormitoryProfileImage",
  "dormProfileImage"
).uploadImage;

const uploadDormDocument = new UploadImage(
  "image/dormDocumentImage",
  "dormDocument"
).uploadImage;

const dormitoryController = require("../controller/dormitoryController");
const dormImageController = require("../controller/dormImageController");
const adminUserController = require("../controller/adminUserController");

const route = express.Router();

route.post(
  "/create-new-dormitory",
  requireAuth,
  dormitoryController.createNewDormitory
);

route.post(
  "/add-dormitory-profile-image",
  [requireAuth, uploadDormProfileImage],
  dormImageController.addDormitoryProfileImage
);

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

route.get(
  "/view-dormitory-detail/:dormId",
  dormitoryController.viewDormitoryDetail
);

route.get("/search-dormitory", dormitoryController.searchDormitory);

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

route.put(
  "/dormitory-switch",
  requireAuth,
  dormitoryController.dormitorySwitch
);

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

module.exports = route;
