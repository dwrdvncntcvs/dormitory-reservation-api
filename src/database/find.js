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
  //Dormitory Segments
  findDormitoryDocumentSegment: (dormId) => {
    const dormitoryDocumentSegment = db.DormDocument.findAll({
      where: { dormitoryId: dormId },
    });

    return dormitoryDocumentSegment;
  },
  findDormitoryLocationSegment: (dormId) => {
    const dormitoryLocationSegment = db.DormLocation.findAll({
      where: { dormitoryId: dormId },
    });

    return dormitoryLocationSegment;
  },
  findDormitoryLandmarkSegment: (dormId) => {
    const dormitoryLocationSegment = db.Landmark.findAll({
      where: { dormitoryId: dormId },
    });

    return dormitoryLocationSegment;
  },
  findDormitoryRoomSegment: (dormId) => {
    const dormitoryRoomSegment = db.Room.findAll({
      where: { dormitoryId: dormId },
    });

    return dormitoryRoomSegment;
  },
  findDormitoryAmenitySegment: (dormId) => {
    const dormitoryAmenitySegment = db.Amenity.findAll({
      where: { dormitoryId: dormId },
    });

    return dormitoryAmenitySegment;
  },
  findUserDocumentsData: (userId) => {
    const userDocumentsData = db.Document.findAll({
      where: { userId: userId },
    });

    return userDocumentsData;
  },
  findPaymentData: (paymentId) => {
    const paymentData = db.Payment.findOne({
      where: { id: paymentId, isValid: false },
    });

    return paymentData;
  },
  findPaymentRefData: (referenceNumber) => {
    const paymentRefData = db.Payment.findOne({
      where: { referenceNumber },
    });
    return paymentRefData;
  },
  findNotValidPayment: () => {
    const notValidPayment = db.Payment.count({
      where: { isValid: false },
    });
    return notValidPayment;
  },
};
