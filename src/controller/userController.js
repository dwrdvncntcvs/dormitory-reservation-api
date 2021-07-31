const db = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const validator = require('../validator/validator');

//ADD PROFILE IMAGE
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

//CREATE NEW INFORMATION
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
            return res.status(401).send({msg: "Can't submit empty field"});
        }

        const salt = await bcrypt.genSalt(10, "a");
        const password = await bcrypt.hash(plainPassword, salt);

        const verifyPassword = await bcrypt.compare(plainConfirmPassword, password);

        if (!verifyPassword) {
            return res.status(401).send({
                msg: "Passwords are not the same."
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

//SIGN IN WITH EXISTING INFORMATION
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
                msg: "Can't submit empty fields"
            });
        }

        const user = await db.User.findOne({
            where: { username, role }
        });

        if (!user) {
            return res.status(401).send({
                msg: "Invalid Username and Password" 
            });
        }

        const validatedPassword = await bcrypt.compare(plainPassword, user.password);

        if (!validatedPassword) {
            return res.status(401).send({
                msg: "Invalid Username and Password"
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
//This is not only for showing user information but also their dormitories and some images
exports.userProfile = async (req, res) => {
    try {
        const user = req.user;

        const profileImage = await db.ProfileImage.findOne({
            where: {userId: user.id}
        });

        const userDormitory = await db.Dormitory.findAll({
            where: {userId: user.id}
        });

        return res.send({
            user,
            profileImage,
            userDormitory,
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            msg: "Something went wrong",
        })
    }
};

//DELETE PROFILE IMAGE
exports.deleteProfileImage = async (req, res) => {
    const userData = req.user;
    
    const t = await db.sequelize.transaction();
    try {
        await db.ProfileImage.destroy({
            where: {userId: userData.id}
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Successfully Deleted"
        });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//EDIT USER INFORMATION
//EDIT ONLY NAME
exports.editProfileName = async (req, res) => {
    const { name } = req.body;

    const t = await db.sequelize.transaction();
    const userData = req.user;
    try {
        await db.User.update({
            name
        }, {
            where: {id: userData.id}
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Name successfully updated"
        });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//EDIT ONLY USERNAME
exports.editProfileUsername = async (req, res) => {
    const { username } = req.body;

    const t = await db.sequelize.transaction();
    const userData = req.user;
    try {
        const user = await db.User.count({
            where: { username }
        });

        if (user !== 0) {
            return res.status(401).send({ msg: "Error 1"}) // To be changed soon
        }

        await db.User.update({
            //To be edited
            username
        }, {
            //Finding what to edit
            where: { id: userData.id }
        }, {
            transaction: t  
        });
        await t.commit();

        return res.send({
            msg: "Username successfully updated"
        });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//EDIT ONLY ADDRESS
exports.editProfileAddress = async (req, res) => {
    const { address } = req.body;

    const userData = req.user;
    const t = await db.sequelize.transaction();
    try {
        await db.User.update({
            address
        }, {    
            where: { id: userData.id }
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Address updated successfully"
        });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//Checks email address to change user's password.
exports.checkUserEmail = async (req, res) => {
    const email = req.params.email;

    try {
        const user = await db.User.findOne({
            where: {email} 
        });
        console.log(user)
        if (!user) {
            return res.status(401).send({
                msg: "Error 1" // To be changed soon.
            });
        }

        return res.send({
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//Checks the uuid of the user to let them change their password.
exports.changeUserPassword = async (req, res) => {
    const { id, plainPassword, plainConfirmPassword } = req.body;

    const t = await db.sequelize.transaction();
    try {
        //Checking if fields are null or not.
        if (plainPassword === null && plainConfirmPassword === null) {
            return res.status(401).send({
                msg: "Error 1" // To be change soon.
            });
        }
        
        //For salting and hashing password
        const salt = await bcrypt.genSalt(10, "a");
        const password = await bcrypt.hash(plainPassword, salt);

        const verifiedPassword = await bcrypt.compare(plainConfirmPassword, password);
        console.log("Password to be saved: ", password);

        if (!verifiedPassword) {
            return res.status(401).send({
                msg: "Error 2" // To be change soon.
            });
        }
        
        await db.User.update({
            password
        }, {
            where: { id }
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Password Successfully Changed"
        });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//To add new documents
exports.addUserDocuments = async (req, res) => {
    const { 
        documentName, 
        documentType,
    } = req.body;
    const userData = req.user;

    const t = await db.sequelize.transaction();
    try {
        const documents = await db.Document.create({
            documentName, 
            documentType, 
            filename: req.file.filename, 
            filepath: req.file.path, 
            mimetype: req.file.mimetype, 
            size : req.file.size,
            userId: userData.id,
        });

        return res.send({
            documents
        });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//For ADMIN only.
//This function will let the admins to manually or perssonaly validate 
//users depends on the documents or ids that they will uploading.
exports.displayAllUsers = async (req, res) => {
    const userData = req.user;

    const validRole = validator.isValidRole(userData.role, 'admin');
    try {
        if (validRole === false) {
            return res.status(401).send({
                msg: "You're not an admin"
            });
        }
        const adminUsers = await db.User.findAll({
            where: { role: 'admin' },
            include: [db.ProfileImage, db.Document]
        });

        const ownerUsers = await db.User.findAll({
            where: { role: 'owner' },
            include: [db.ProfileImage, db.Document, db.Dormitory]
        });

        const tenantUsers = await db.User.findAll({
            where: { role: 'tenant'},
            include: [db.ProfileImage, db.Document]
        });


        return res.send({
            adminUsers,
            ownerUsers,
            tenantUsers
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//TO VERIFY THE USERS
exports.verifyUser = async (req, res) => {
    const { id, isValid } = req.body;
    const userData = req.user;

    const validRole = validator.isValidRole(userData.role, 'admin');
    const t = await db.sequelize.transaction();
    try {
        if (validRole === false) {
            return res.status(401).send({
                msg: "You're not an admin"
            });
        }

        await db.User.update({
            isValid
        }, {
            where: {id}
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Account Successfully Verified"
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(404).send({
            msg: "Something went wrong"
        });
    }
};

//DELETE USER INFORMATION
//Delete functionality that an admin user can only access.
//This function is not yet complete until this comment is deleted.
exports.deleteUser = async (req, res) => {
    const { id } = req.body;
    const userData = req.user;

    const validRole = validator.isValidRole(userData.role, 'admin');
    const t = await db.sequelize.transaction();
    try {
        if(validRole === false) {
            return res.status(401).send({
                msg: "You are not an admin!"
            })
        }

        const user = await db.User.findOne({
            where: { id: id }
        });

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

        await db.Document.destroy({
            where: {userId: user.id}
        }, {
            transaction: t
        });

        await db.Dormitory.destroy({
            where: {userId: user.id},
            include: [db.DormProfileImage]
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