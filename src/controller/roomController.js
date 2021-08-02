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
        //Check Role
        if (validRole === false) {
            return res.status(401).send({
                msg: "You are not an owner."
            });
        }

        //Find Dorm
        const dormitory = await db.Dormitory.findOne({
            where: { id: dormId }
        });

        //Check if the dorm exists
        if (!dormitory) {
            return res.status(401).send({
                msg: "Dormitory doesn't exists"
            });
        }

        //Check if right user
        if (userData.id !== dormitory.userId) {
            return res.status(401).send({
                msg: "You can't create a room for this dormitory."
            });
        }

        //Check if dorm is verified
        if (dormitory.isVerified === false) {
            return res.status(401).send({
                msg: "Your dormitory is not verified"
            });
        }

        const roomDetail = await db.Room.create({
            name: roomName,
            capacity: roomCapacity, 
            dormitoryId: dormId
        }, {
            transaction: t
        });
        await t.commit();

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