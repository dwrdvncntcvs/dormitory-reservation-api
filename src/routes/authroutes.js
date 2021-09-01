const express = require("express");
const multer = require("multer");
const path = require("path");

//Middlewares
const requireAuth = require("../middlewares/requireAuth");

//Controllers || Functions that will do of the endpoints
const userController = require("../controller/userController");
const userImageController = require("../controller/userImageController");
const adminUserController = require("../controller/adminUserController");

const route = express.Router();

//Multer Engine for saving Profile Images
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/profileImage");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//For uploading Profile Images
const uploadProfileImage = multer({
  storage: profileImageStorage,
}).single("profileImage");

//Multer Engine for saving picture of valid documents
const documentsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/documentImage");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//For uploading Documents Images
const uploadDocumentImages = multer({
  storage: documentsStorage,
}).single("documentImage"); //To be change soon to multiple uploads

//POST METHOD
//Need to change on how to get the ID of the user later.
//This needs the user to be authenticated before adding a profile image.
route.post(
  "/add-profile-image",
  [requireAuth, uploadProfileImage],
  userImageController.addProfilePic
);

//To add user documents like valid Ids
route.post(
  "/add-user-documents",
  [requireAuth, uploadDocumentImages],
  userImageController.addUserDocuments
);

//Create Account and Sign In
route.post("/sign-up", userController.signUp);

route.post("/sign-in", userController.signIn);

//GET METHOD
//This needs the user to be authenticated before the user view his/her profile details
route.get("/user-profile", requireAuth, userController.userProfile);

route.get("/find-user/:email", userController.checkUserEmail);

//ADMIN ONLY
//To get or display users information
route.get("/get-all-users", requireAuth, adminUserController.displayAllUsers);

//PUT METHOD
//To edit the name of the user
route.put("/edit-user-name", requireAuth, userController.editProfileName);

//To edit the username of the user
route.put(
  "/edit-user-username",
  requireAuth,
  userController.editProfileUsername
);

//To edit the address of the user
route.put("/edit-user-address", requireAuth, userController.editProfileAddress);

//To change the password of the user
route.put("/change-user-password", userController.changeUserPassword);

//ADMIN ONLY!!!
//To verify the account of the user
route.put("/verify-user", requireAuth, adminUserController.verifyUser);

//To verify the dormitory created by the owner user
route.put(
  "/verify-dormitory",
  requireAuth,
  adminUserController.verifyDormitory
);

route.put("/verify-account/:id", userController.verifyEmail);

//DELETE METHOD
//Delete functionality that an admin user can only access.
//This endpoint is not yet complete until this comment is deleted.

//To delete a user
route.delete(
  "/delete-user-profile",
  requireAuth,
  adminUserController.deleteUser
);

//To delete the profile image of the user
route.delete(
  "/delete-profile-image",
  requireAuth,
  userImageController.deleteProfileImage
);

module.exports = route;
