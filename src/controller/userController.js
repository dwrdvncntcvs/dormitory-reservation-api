const db = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

//Need to change on how to get the ID of the user later.
//This needs the user to be authenticated before adding a profile image
exports.addProfilePic = async (req, res) => {
    const userData = req.user;
    const t = await db.sequelize.transaction();
    try {
        
        //From line 11 - 19 will be deleted if middleware for authentication is added
        const user = await db.User.findOne({
            where: { id: userData.id }
        });

        if (!user) {
            return res.status(404).send({msg: "Not Found"});
        }

        const profileImage = await db.ProfileImage.create({
            filename: req.file.filename,
            filepath: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            userId: user.id
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Profile Image Uploaded",
            profileImage
        })    ;
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

exports.signUp = async (req, res) => {
    const {
        name,
        username,
        email,
        plainPassword,
        plainConfirmPassword,
        contactNumber,
        address,
        role
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
            address === null && 
            role === null
        ) {
            return res.status(401).send({msg: "Error 1"}); //TO BE CHANGED SOON
        }

        const salt = await bcrypt.genSalt(10, "a");
        const password = await bcrypt.hash(plainPassword, salt);

        const verifyPassword = await bcrypt.compare(plainConfirmPassword, password);

        if (!verifyPassword) {
            return res.status(401).send({
                msg: "Error 2" //TO BE CHANGED SOON
            });
        }

        await db.User.create({
            name,
            username,
            email,
            password,
            contactNumber,
            address,
            role
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
        return res.status(500).send({
            msg: 'Something went wrong',
            err
        })

    }
};

exports.signIn = async (req, res) => {
    const { 
        username, 
        plainPassword, 
        role 
    } = req.body;

    try {
        if (
            username === null &&
            plainPassword === null &&
            role === null
        ) { 
            return res.status(401).send({
                msg: "Error 1" //TO BE CHANGED SOON
            });
        }

        const user = await db.User.findOne({
            where: { username, role }
        });

        if (!user) {
            return res.status(401).send({
                msg: "Error 2" //TO BE CHANGED SOON
            });
        }

        const validatedPassword = await bcrypt.compare(plainPassword, user.password);

        if (!validatedPassword) {
            return res.status(401).send({
                msg: "Error 3" //TO BE CHANGED SOON
            });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role }, config.secretKey);

        return res.send({
            msg: "Successfully Sign In",
            user,
            token
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            msg: "Something went wrong",
            err
        });
    }
};

//This needs the user to be authenticated before the user view his/her profile details
//This is not only for showing user information but also
exports.userProfile = async (req, res) => {

    try {
        const user = req.user;

        const profileImage = await db.ProfileImage.findOne({
            where: {userId: user.id}
        });

        return res.send({
            user,
            profileImage
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            msg: "Something went wrong",
        })
    }
};

//Delete functionality that an admin user can only access.
exports.deleteUser = async (req, res) => {
    const { id } = req.body;
    const userData = req.user;

    const t = await db.sequelize.transaction();
    try {
        if(userData.role !== 'admin') {
            return res.status(401).send({
                msg: "You are not an admin!"
            })
        }

        const user = await db.User.findOne({
            where: { id: id }
        });
        console.log('---User: ', user)

        await db.User.destroy({ 
            where: {id: user.id}
        }, {
            transaction: t
        });

        await db.ProfileImage.destroy({
            where: {userId: user.id}
        }, {
            transaction: t
        });

        return res.send({
            msg: "Deleted Successfully"
        })
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong",
            err
        })
    }
};