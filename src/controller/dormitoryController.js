const db = require('../../models');
const validator = require('../validator/validator');

//To create and input new information of a dormitory in the system.
exports.createNewDormitory = async (req, res) => {
    const { name, address, contactNumber } = req.body;
    const userData = req.user;

    const validRole = validator.isValidRole(userData.role, 'owner');
    const t = await db.sequelize.transaction();
    try {
        if (validRole === false) {
            return res.status(401).send({
                msg: "You are not an owner."
            });
        }

        if (userData.isVerified !== true) {
            return res.status(401).send({
                msg: "Your account is not verified." //To be change soon.
            });
        }

        if (
            name === null &&
            address === null &&
            contactNumber === null
        ) {
            return res.status(401).send({
                msg: "Can't submit empty field." //To be change soon.
            });
        }

        await db.Dormitory.create({
            name,
            address,
            contactNumber,
            userId: userData.id
        }, { 
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Dormitory Successfully Created."
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//To add profile image of a dormitory.
exports.addDormitoryProfileImage = async (req, res) => {
    const { id } = req.body;
    const userData = req.user;

    const validRole = validator.isValidRole(userData.role, 'owner');
    const t = await db.sequelize.transaction();
    try {
        if (validRole === false) {
            return res.status(401).send({
                msg: "You are not a dormitory owner"
            });
        }

        const dormitory = await db.Dormitory.findOne({
            where: { id }
        });
        console.log(dormitory);

        if (!dormitory) {
            return res.status(404).send({
                msg: "Dormitory Not Found"
            });
        }

        const dormitoryImage = await db.DormProfileImage.create({
            filename: req.file.filename,
            filepath: req.file.path,
            mimetype: req.file.mimetype,
            size : req.file.size,
            dormitoryId: dormitory.id
        });

        return res.send({
            msg: "Dorm Profile Image Successfully Added",
            dormitoryImage
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(500).send({
            msg: 'Something went wrong'
        });
    }
};

//To view all the dormitory created by the user.
exports.viewUserDormitory = async (req, res) => {
    const userData = req.user;

    const validRole = validator.isValidRole(userData.role, 'owner');
    try {
        if (validRole === false) {
            return res.status(401).send({
                msg: "You are not a dormitory owner."
            });
        }

        const userDormitories = await db.Dormitory.findAll({
            where: { userId: userData.id },
            include: [db.User, db.DormProfileImage]
        });

        return res.send({
            userDormitories
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//To create or add dormitory documents to be verified by admins
exports.addDormitoryDocuments = async (req, res) => {
    const {
        documentName,
        documentType,
        dormId
    } = req.body;
    const userData = req.user;

    const t = await db.sequelize.transaction();
    try {
        const validRole = validator.isValidRole(userData.role, 'owner');

        if (validRole === false) {
            return res.status(401).send({
                msg: "You are not an owner"
            });
        }

        const userDorm = await db.Dormitory.findOne({
            where: { id: dormId }
        });

        if (!userDorm) {
            return res.status(404).send({
                msg: "Dorm Doesn't exist"
            });
        }

        if (userDorm.userId !== userData.id) {
            return res.status(404).send({
                msg: "This dormitory is not yours"
            });
        }

        const dormDocument = await db.DormDocument.create({
            documentName,
            documentType,
            dormitoryId: dormId,
            filename: req.file.filename,
            filepath: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

        return res.send({
            msg: "Dormitory Documents Successfully Added",
            dormDocument
        })
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        })
    }
};

//To delete dormitory
exports.deleteDormitory = async (req, res) => {
    const { id } = req.body;
    const userData = req.user;
    const validRole = validator.isValidRole(userData.role, 'owner');

    const t = await db.sequelize.transaction();
    try {
        if (validRole === false) {
            return res.status(401).send({
                msg: "You are not an owner"
            });
        }

        await db.Dormitory.destroy({
            where: { id }
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Dormitory was successfully deleted"
        });        
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

//To view the dormitories detail of an owner.
exports.viewUserDormitoryDetail = async (req, res) => {
    const dormId = req.params.dormId;
    const userData = req.user;
    const validRole = validator.isValidRole(userData.role, 'owner');

    try {
        if (validRole === false) {
            return res.status(401).send({msg: "You are not an owner."});
        }

        const dormitoryDetail = await db.Dormitory.findOne({
            where: { id: dormId},
        });

        if (!dormitoryDetail) {
            return res.status(401).send({msg: "Dormitory doesn't exists."});
        }

        if (dormitoryDetail.userId !== userData.id) {
            return res.status(401).send({msg: "You are not the owner of this dorm."});
        }

        const room = await db.Room.findAll({
            where: { dormitoryId: dormitoryDetail.id }
        });

        const dormDocument = await db.DormDocument.findAll({
            where: { dormitoryId: dormitoryDetail.id }
        });

        const dormImage = await db.DormImage.findAll({
            where: { dormitoryId: dormitoryDetail.id }
        });

        const dormProfileImage = await db.DormProfileImage.findAll({
            where: { dormitoryId: dormitoryDetail.id }
        });

        return res.send({
            dormitory: {
                dormitoryDetail,
                dormDocument,
                room,
                dormImage,
                dormProfileImage
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};