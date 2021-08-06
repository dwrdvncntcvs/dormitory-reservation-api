const db = require('../../models');
const validator = require('../validator/validator');

exports.addDormImage = async (req, res) => {
    const { 
        name, 
        dormId 
    } = req.body;
    
    const userData = req.user;
    const validRole = validator.isValidRole(userData.role, 'owner');
    const validDormitory = await db.Dormitory.findOne({
        where: { id: dormId }
    });

    const t = await db.sequelize.transaction();
    try {
        //Check user's role
        if (validRole === false) {
            return res.status(401).send({ message: 'You are not an owner.'});
        }

        //Check if the dormitory was owned by the owner user
        if (userData.id !== validDormitory.userId) {
            return res.status(401).send({ message: "You cannot add images to this dormitory."})
        }

        await db.DormImage.create({
            name,
            filename: req.file.filename,
            filepath: req.file.path,
            mimetype: req.file.mimetype,
            size : req.file.size,
            dormitoryId: dormId
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Image Successfully Added",
        });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};

exports.deleteDormImage = async (req, res) => {
    const { imageId, dormId } = req.body;
    const userData = req.user;
    const dormitoryData = await db.Dormitory.findOne({
        where: { id: dormId }
    });
    const dormImageData = await db.DormImage.findOne({
        where: { id: imageId }
    });
    const validRole = validator.isValidRole(userData.role, 'owner');

    const  t = await db.sequelize.transaction();
    try {
        if (validRole === false) {
            return res.status(401).send({
                msg: "You are not a owner user"
            });
        }

        if (!dormitoryData) {
            return res.status(404).send({
                msg: "Dormitory does not exist"
            });
        }

        if (!dormImageData) {
            return res.status(404).send({
                msg: "Dormitory Image does not exist"
            });
        }

        if (dormitoryData.userId !== user.id) {
            return res.status(404).send({
                msg: "This dormitory is not yours"
            });
        }

        if (dormitoryData.id !== dormImageData.dormitoryId) {
            return res.status(404).send({
                msg: "This image doesn't belong to this dormitory"
            });
        }

        await db.DormImage.destroy({
            where: { id: dormImageData.id }
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Image Successfully Deleted"
        });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).json({
            msg: "Something went wrong"
        });
    }
};