const express = require('express');
const db = require('../models');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(authRoutes);

app.listen(PORT, () => {
    console.log(`Server is up: http://localhost:${PORT}`);
    db.sequelize.authenticate();
    console.log('Successfully connected to Postgres SQL :)')
});