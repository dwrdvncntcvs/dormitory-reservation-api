const express = require('express');
const multer = require('multer');
const path = require('path');
const userController = require('../controller/userController');

const route = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'profileImage');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
}).single('profileImage');

route.post('/sign-up', userController.signUp);

module.exports = route;