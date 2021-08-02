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

//To add a room payment information that the user will be able to see.
exports.addRoomPayment = async(req, res) => {
    const { 
        roomCost,
        electricBill,
        waterBill,
        dormitoryId,
        roomId
    } = req.body;
    const userData = req.user;

    const t = await db.sequelize.transaction();
    const validRole = validator.isValidRole(userData.role, 'owner');    
    try {
        if (validRole === false) {
            return res.status(500).send({
                msg: "You are not an owner"
            });
        }

        const dormitory = await db.Dormitory.findOne({
            where: { id: dormitoryId }
        });

        if(!dormitory) {
            return res.status(500).send({
                msg: "Dormitory doesn't exists"
            });
        }

        if(dormitory.userId !== userData.id) {
            return res.status(500).send({
                msg: "This dormitory doesn't belongs to you"
            });
        }

        const room = await db.Room.findOne({
            where: { id: roomId }
        });

        if (!room) {
            return res.status(500).send({
                msg: "Room doesn't exists"
            });
        }

        if (dormitory.id !== room.dormitoryId) {
            return res.status(500).send({
                msg: "Room doesn't belongs to this dormitory"
            });
        }

        const roomPayment = await db.RoomPayment.create({
            roomCost,
            electricBill,
            waterBill,
            dormitoryId,
            roomId
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: `Payment for ${room.name} added`
        });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
}; 