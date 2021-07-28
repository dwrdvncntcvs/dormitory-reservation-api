const express = require('express');
const multer = require('multer');
const path = require('path');
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

route.post('/add-profile-image', upload, userController.addProfilePic);

route.post('/sign-up', userController.signUp);

route.post('/sign-in', userController.signIn);

module.exports = route;