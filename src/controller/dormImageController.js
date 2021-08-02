const db = require('../../models');
const validator = require('../validator/validator');

exports.addDormImage = async (req, res) => {
    const { name, dormId } = req.body;
    const userData = req.user;
    const validRole = validator.isValidRole(userData.role, 'owner');

    const t = await db.sequelize.transaction();
    try {
        if (validRole === false) {
            return res.status(401).send({ message: 'You are not an owner.'});
        }

        const validDormitory = await db.Dormitory.findOne({
            where: { id: dormId }
        });

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