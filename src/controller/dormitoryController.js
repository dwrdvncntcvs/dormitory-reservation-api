const db = require('../../models');

exports.createNewDormitory = async (req, res) => {
    const { name, address, contactNumber } = req.body;

    const userData = req.user;
    const t = await db.sequelize.transaction();
    try {
        if (userData.role !== 'owner') {
            return res.status(401).send({
                msg: "You are not an owner."
            });
        }

        if (userData.isValid !== true) {
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

exports.addDormitoryProfileImage = async (req, res) => {
    const { id } = req.body;
    const userData = req.user;

    const t = await db.sequelize.transaction();
    try {
        if (userData.role !== 'owner') {
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

exports.viewUserDormitory = async (req, res) => {
    const userData = req.user;

    try {
        if (userData.role !== 'owner') {
            return res.status(401).send({
                msg: "You are not a dormitory owner."
            });
        }

        const userDormitories = await db.Dormitory.findAll({
            where: { userId: userData.id },
            include: [db.DormProfileImage]
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