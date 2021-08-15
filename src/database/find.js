const db = require("../../models");

module.exports = {
  findDormitoryData: (dormId) => {
    const dormitoryData = db.Dormitory.findOne({
      where: { id: dormId },
    });

    return dormitoryData;
  },
  findRoomData: (roomId) => {
    const roomData = db.Room.findOne({
      where: { id: roomId }
    });
  
    return roomData;
  },
  findReservationData: (reservationId) => {
    const reservationData = db.Reservation.findOne({
      where: { id: reservationId }
    });
  
    return reservationData;
  },
  findDormImageData: (dormImageId) => {
    const dormImageData = db.DormImage.findOne({
      where: { id: dormImageId },
    });

    return dormImageData;
  }
};
