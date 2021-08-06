const db = require("../../models");

//For Tenant Users
exports.createNewReservation = async (req, res) => {
    const {
        dormId,
        roomId,
        name,
        email,
        address,
        contactNumber
    } = req.body;

    const userData = req.user;
    const validRole = validator.isValidRole(userData.role, "tenant");
    const dormitoryData = await db.Dormitory.findOne({
        where: { id: dormId }
    });
    const roomData = await db.Room.findOne({
        where: { id: roomId } 
    });

    const t = await db.sequelize.transaction();
    try {
        if (validRole === false) {
            return res.status(401).send({
                msg: "You are not a tenant user"
            });
        }

        if (!dormitoryData) {
            return res.status(404).send({
                msg: "Dormitory doesn't exist"
            });
        }

        if (!roomData) {
            return res.status(404).send({
                msg: "Room doesn't exist"
            });
        }

        if (roomData.dormitoryId !== dormitoryData.id) {
            return res.status(401).send({
                msg: "This room doesn't belongs to the dormitory"
            });
        }

        const reservation = await db.Reservation.create({
            dormitoryId: dormId,
            roomdId,
            name,
            email,
            address,
            contactNumber
        }, {
            transaction: t
        });
        await t.commit();

        return res.send({
            msg: "Reservation Created.",
            reservation
        })
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).send({
            msg: "Something went wrong"
        });
    }
};