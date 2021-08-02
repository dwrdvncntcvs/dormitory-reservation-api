const express = require('express');
const db = require('../models');

//Routes
const authRoutes = require('./routes/authRoutes');
const dormitoryRoutes = require('./routes/dormitoryRoutes');
const roomRoutes = require('./routes/roomRoutes');
const dormImageRoutes = require('./routes/dormImageRoutes');

//Initializing express in variable app.
const app = express();
const PORT = process.env.PORT || 3000;
const divider = '=========================================';

//To allow JSON text formats
app.use(express.json());

//To Connect the routes
app.use(authRoutes);
app.use(dormitoryRoutes);
app.use(roomRoutes);
app.use(dormImageRoutes);

//To render the images using their paths.
app.use('/image/profileImage', express.static('image/profileImage'));
app.use('/image/dormitoryProfileImage', express.static('image/dormitoryProfileImage'));
app.use('/image/dormDocumentImage', express.static('image/dormDocumentImage'));
app.use('/image/documentImage', express.static('image/documentImage'));
app.use('/image/dormImage', express.static('image/dormImage'));

app.listen(PORT, () => {
    console.log(divider);
    console.log(`Server is up: http://localhost:${PORT}`);
    db.sequelize.authenticate();
    console.log('Successfully connected to Postgres SQL :)');
    console.log(divider);
});