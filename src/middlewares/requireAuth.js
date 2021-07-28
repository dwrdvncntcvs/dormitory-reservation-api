const db = require('../../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        console.log("No Authorization Header");
        return res.status(401).send({ msg: "Please sign in first." })
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, config.secretKey, async (err, payload) => {
        if (err) {
            console.log("No Authorization Header");
            return res.status(401).send({ msg: "Please sign in first." });
        }

        const { id, email, role } = payload;
        const user = await db.User.findOne({
            where: { id, email, role }
        });

        req.user = user;
        next();
    })
};