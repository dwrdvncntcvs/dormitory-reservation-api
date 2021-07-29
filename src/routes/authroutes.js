const express = require('express');
const multer = require('multer');
const path = require('path');

//Middlewares
const requireAuth = require('../middlewares/requireAuth');

//Controllers || Functions that will do of the endpoints
const userController = require('../controller/userController');

const route = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image/profileImage');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
}).single('profileImage');

//POST METHOD
//Need to change on how to get the ID of the user later.
//This needs the user to be authenticated before adding a profile image
route.post('/add-profile-image', [requireAuth, upload], userController.addProfilePic);

route.post('/sign-up', userController.signUp);

route.post('/sign-in', userController.signIn);

//GET METHOD
//This needs the user to be authenticated before the user view his/her profile details
route.get('/user-profile', requireAuth, userController.userProfile);

//PUT METHOD
route.put('/edit-user-name', requireAuth, userController.editProfileName);

route.put('/edit-user-username', requireAuth, userController.editProfileUsername);

route.put('/edit-user-address', requireAuth, userController.editProfileAddress);

//DELETE METHOD
//Delete functionality that an admin user can only access.
//This endpoint is not yet complete until this comment is deleted.
route.delete('/delete-user-profile', requireAuth, userController.deleteUser);

route.delete('/delete-profile-image', requireAuth, userController.deleteProfileImage);

module.exports = route;