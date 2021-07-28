const express = require('express');
const db = require('../models');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    return res.send({
        mgs: 'Hello World'
    });
});

app.listen(PORT, () => {
    console.log(`Server is up: http://localhost:${PORT}`);
    db.sequelize.authenticate();
    console.log('Successfully connected to Postgres SQL :)')
});