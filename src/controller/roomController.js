const db = require('../../models');
const validator = require('../validator/validator');

// To create new room in a dormitory
exports.createNewRoom = async (req, res) => {
    const { 
        dormId, 
        roomName, 
        roomCapacity, 
    } = req.body;

    const userData = req.user;
    const validRole = validator.isValidRole(userData.role, 'owner');
    const t = await db.sequelize.transaction();
    try {
        if (validRole === false) {
            return res.status(401).send({
                msg: "You are not an owner."
            });
        }

        const dormitory = await db.Dormitory.findOne({
            where: { id: dormId }
        });

        if (userData.id !== dormitory.userId) {
            return res.status(401).send({
                msg: "You can't create a room for this dormitory."
            });
        }

        const roomDetail = await db.Room.create({
            name: roomName,
            capacity: roomCapacity, 
            dormitoryId: dormId
        });

        return res.send({
            roomDetail
        });
    } catch (err) {
        await t.rollback();
        console.log(err);
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
}; 