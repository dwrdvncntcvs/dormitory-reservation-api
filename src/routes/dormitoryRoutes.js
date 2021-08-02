//Imports Here
const express = require('express');
const multer = require('multer');
const path = require('path');
const requireAuth = require('../middlewares/requireAuth');

//Engine for dorm documents storage
const dormDocumentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image/dormDocumentImage');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Engine for dormitory profile image
const dormProfileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image/dormitoryProfileImage');
    }, 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//To upload dormitory profile image
const uploadDormProfileImage = multer({
    storage: dormProfileImageStorage,
}).single('dormProfileImage');

const uploadDormDocument = multer({
    storage: dormDocumentStorage,
}).single('dormDocument');

//Import Dormitory Controller || Functions
const dormitoryController = require('../controller/dormitoryController');

const route = express.Router();

//Endpoints Here
//To create new dormitory
route.post('/create-new-dormitory', requireAuth, dormitoryController.createNewDormitory);

//To add profile image of a dormitory
route.post('/add-dormitory-profile-image', [ requireAuth, uploadDormProfileImage],dormitoryController.addDormitoryProfileImage);

//To add Dormitory Documents that will verify by the adminUsers
route.post('/add-dormitory-documents', [requireAuth, uploadDormDocument], dormitoryController.addDormitoryDocuments);

//To get all the dormitories that the user have.
route.get('/view-all-dormitories', requireAuth, dormitoryController.viewUserDormitory);

//To delete dormitory information
route.delete('/delete-dormitory', requireAuth, dormitoryController.deleteDormitory);

//Export Here
module.exports = route;