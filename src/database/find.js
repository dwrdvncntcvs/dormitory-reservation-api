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
      where: { id: roomId },
    });

    return roomData;
  },
  findReservationData: (reservationId) => {
    const reservationData = db.Reservation.findOne({
      where: { id: reservationId },
    });

    return reservationData;
  },
  findDormImageData: (dormImageId) => {
    const dormImageData = db.DormImage.findOne({
      where: { id: dormImageId },
    });

    return dormImageData;
  },
  findDormRatingData: (dormRatingId) => {
    const dormRatingData = db.DormRating.findOne({
      where: { id: dormRatingId },
    });

    return dormRatingData;
  },
  findDormitoryQuestion: (questionId) => {
    const questionData = db.Question.findOne({
      where: { id: questionId },
    });

    return questionData;
  },
  findDormitoryComment: (commentId) => {
    const commentData = db.Comment.findOne({ where: { id: commentId } });

    return commentData;
  },
  findAmenity: (amenityId) => {
    const amenityData = db.Amenity.findOne({ where: { id: amenityId } });

    return amenityData;
  },
  findDormProfileImageData: (dormProfileImageId) => {
    const dormProfileImageData = db.DormProfileImage.findOne({
      where: { id: dormProfileImageId },
    });

    return dormProfileImageData;
  },
  findUserData: (userId) => {
    const userData = db.User.findOne({ where: { id: userId } });

    return userData;
  },
};
