const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const { UploadImage } = require("../middlewares/uploadImage");

const userController = require("../controller/userController");
const userImageController = require("../controller/userImageController");
const adminUserController = require("../controller/adminUserController");

const route = express.Router();

const uploadProfileImage = new UploadImage("image/profileImage", "profileImage")
  .uploadImage;

const uploadDocumentImages = new UploadImage(
  "image/documentImage",
  "documentImage"
).uploadImage;

route.post(
  "/add-profile-image",
  [requireAuth, uploadProfileImage],
  userImageController.addProfilePic
);

route.post(
  "/add-user-documents",
  [requireAuth, uploadDocumentImages],
  userImageController.addUserDocuments
);

route.post("/sign-up", userController.signUp);

route.post("/sign-in", userController.signIn);

route.get("/user-profile", requireAuth, userController.userProfile);

route.post("/find-user/:email", userController.checkUserEmail);

route.get(
  "/get-user-detail/user-:userId",
  requireAuth,
  adminUserController.userDetails
);

route.get(
  "/get-all-users/:role",
  requireAuth,
  adminUserController.displayAllUsers
);

route.put("/edit-user-name", requireAuth, userController.editProfileName);

route.put(
  "/edit-user-username",
  requireAuth,
  userController.editProfileUsername
);

route.put("/edit-user-address", requireAuth, userController.editProfileAddress);

route.put("/change-user-password", userController.changeUserPassword);

route.put("/verify-user", requireAuth, adminUserController.verifyUser);

route.put(
  "/verify-dormitory",
  requireAuth,
  adminUserController.verifyDormitory
);

route.get("/verify-account/:id", userController.verifyEmail);

route.delete(
  "/delete-user-profile/:id",
  requireAuth,
  adminUserController.deleteUser
);

route.delete(
  "/delete-profile-image/:id",
  requireAuth,
  userImageController.deleteProfileImage
);

route.delete(
  "/deny-dormitory-verification/userId-:userId/dormitoryId-:dormitoryId",
  requireAuth,
  adminUserController.denyDormitory
);

route.delete(
  "/deny-user-verification/userId-:userId",
  requireAuth,
  adminUserController.denyUsers
);
module.exports = route;
