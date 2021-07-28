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

//Need to change on how to get the ID of the user later.
//This needs the user to be authenticated before adding a profile image
route.post('/add-profile-image', [requireAuth, upload], userController.addProfilePic);

route.post('/sign-up', userController.signUp);

route.post('/sign-in', userController.signIn);

//This needs the user to be authenticated before the user view his/her profile details
route.get('/user-profile', requireAuth, userController.userProfile);

route.delete('/delete-user-profile', requireAuth, userController.deleteUser);

module.exports = route;