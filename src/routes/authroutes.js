const express = require('express');
const multer = require('multer');
const path = require('path');

//Middlewares
const requireAuth = require('../middlewares/requireAuth');

//Controllers || Functions that will do of the endpoints
const userController = require('../controller/userController');

const route = express.Router();

//Multer Engine for saving Profile Images
const profileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image/profileImage');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//For uploading Profile Images
const uploadProfileImage = multer({
    storage: profileImageStorage,
}).single('profileImage');

//Multer Engine for saving picture of valid documents
const documentsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image/documentImage');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//For uploading Documents Images
const uploadDocumentImages = multer({
    storage: documentsStorage
}).single('documentImage'); //To be change soon to multiple uploads

//POST METHOD
//Need to change on how to get the ID of the user later.
//This needs the user to be authenticated before adding a profile image.
//Add iValid
route.post('/add-profile-image', [requireAuth, uploadProfileImage], userController.addProfilePic);

route.post('/add-user-documents', [requireAuth, uploadDocumentImages], userController.addUserDocuments);

//Create Account and Sign In
route.post('/sign-up', userController.signUp);

route.post('/sign-in', userController.signIn);

//GET METHOD
//This needs the user to be authenticated before the user view his/her profile details
route.get('/user-profile', requireAuth, userController.userProfile);

route.get('/find-user/:email', userController.checkUserEmail);

//ADMIN ONLY
route.get('/get-all-users', requireAuth, userController.displayAllUsers);

//PUT METHOD
route.put('/edit-user-name', requireAuth, userController.editProfileName);

route.put('/edit-user-username', requireAuth, userController.editProfileUsername);

route.put('/edit-user-address', requireAuth, userController.editProfileAddress);

route.put('/change-user-password', userController.changeUserPassword);

//ADMIN ONLY!!!
route.put('/verify-user', requireAuth, userController.verifyUser);

//DELETE METHOD
//Delete functionality that an admin user can only access.
//This endpoint is not yet complete until this comment is deleted.
route.delete('/delete-user-profile', requireAuth, userController.deleteUser);

route.delete('/delete-profile-image', requireAuth, userController.deleteProfileImage);

module.exports = route;