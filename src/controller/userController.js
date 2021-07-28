const db = require('../../models');
const bcrypt = require('bcrypt');

exports.signUp = async (req, res) => {
    const {
        name,
        username,
        email,
        plainPassword,
        plainConfirmPassword,
        contactNumber,
        address
    } = req.body;

    const t = await db.sequelize.transaction(); 
    try {
        if (
            name === null && 
            username === null && 
            email === null && 
            plainPassword === null &&
            plainConfirmPassword === null &&
            contactNumber === null && 
            address === null
        ) {
            return res.status(401).send({msg: "Error 1"});
        }

        const salt = await bcrypt.genSalt(10, "a");
        const password = await bcrypt.hash(plainPassword, salt);

        const verifyPassword = await bcrypt.compare(plainConfirmPassword, password);

        if (!verifyPassword) {
            return res.status(401).send({
                msg: "Error 2"
            });
        }

        await db.User.create({
            name,
            username,
            email,
            password,
            contactNumber,
            address
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Successfully Created!"
        });

    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(401).send({
            msg: 'Something went wrong',
            err
        })

    }
};
