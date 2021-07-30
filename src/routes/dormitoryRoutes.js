//Imports Here
const express = require('express');
const multer = require('multer');
const path = require('path');
const requireAuth = require('../middlewares/requireAuth');

const dormProfileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image/dormitoryProfileImage');
    }, 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadDormProfileImage = multer({
    storage: dormProfileImageStorage,
}).single('dormProfileImage');

//Import Dormitory Controller || Functions
const dormitoryController = require('../controller/dormitoryController');

const route = express.Router();

//Endpoints Here
//To create new dormitory
route.post('/create-new-dormitory', requireAuth, dormitoryController.createNewDormitory);

//To add profile image of a dormitory
route.post('/add-dormitory-profile-image', [ requireAuth, uploadDormProfileImage],dormitoryController.addDormitoryProfileImage);

//To get all the dormitories that the user have.
route.get('/view-all-dormitories', requireAuth, dormitoryController.viewUserDormitory);

//Export Here
module.exports = route;