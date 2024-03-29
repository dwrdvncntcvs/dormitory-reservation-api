const db = require("../../models");
const validator = require("../validator/validator");
const {
  findDormitoryData,
  findDormitoryAmenitySegment,
  findDormitoryDocumentSegment,
  findDormitoryLandmarkSegment,
  findDormitoryLocationSegment,
  findDormitoryRoomSegment,
  findReservationData,
} = require("../database/find");
const {
  createNewDormitoryValidator,
  deleteDormitoryValidator,
  dormitorySwitchValidator,
  getDormitoriesByUserReservationValidator,
} = require("../validator/dormitoryValidator");
const { Landmark, Room } = require("../../models");
const { Op } = require("sequelize");
const { getValue } = require("../database/roomFilter");

exports.createNewDormitory = async (req, res) => {
  const { name, address, contactNumber, allowedGender } = req.body;

  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = createNewDormitoryValidator(
    req.body,
    userData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    const dormitory = await db.Dormitory.create(
      {
        name,
        address,
        contactNumber,
        allowedGender,
        userId: userData.id,
      },
      { transaction: t }
    );
    await db.RatingAve.create(
      {
        dormitoryId: dormitory.id,
      },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Dormitory Successfully Created.", dormitory });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.deleteDormitory = async (req, res) => {
  const id = req.params.id;
  const userData = req.user;
  const dormitoryData = await db.Dormitory.findOne({ where: { id } });
  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = deleteDormitoryValidator(
    userData,
    dormitoryData,
    validRole
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    await db.Dormitory.destroy(
      { where: { id: dormitoryData.id } },
      { transaction: t }
    );
    await t.commit();

    return res.send({ msg: "Dormitory was successfully deleted" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.viewDormitoryDetail = async (req, res) => {
  const dormId = req.params.dormId;

  const dormitoryData = await findDormitoryData(dormId);

  if (!dormitoryData)
    return res.status(401).send({ msg: "Dormitory not found" });

  try {
    const dormitory = await db.Dormitory.findOne({
      where: { id: dormitoryData.id },
      include: [
        db.DormProfileImage,
        db.DormDocument,
        db.Amenity,
        db.Room,
        db.DormImage,
        db.Reservation,
        db.DormRating,
        db.DormLocation,
        db.Landmark,
        db.User,
        db.Payment,
        db.RatingAve,
      ],
    });
    const questions = await db.Question.findAll({
      where: { dormitoryId: dormitoryData.id },
      include: [db.Comment],
    });

    return res.send({ dormitory, questions });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.dormitorySwitch = async (req, res) => {
  const { dormId, isAccepting } = req.body;

  const userData = req.user;
  const dormitoryData = await findDormitoryData(dormId);

  const dormitoryAmenitySegment = await findDormitoryAmenitySegment(dormId);
  const dormitoryDocumentSegment = await findDormitoryDocumentSegment(dormId);
  const dormitoryLandmarkSegment = await findDormitoryLandmarkSegment(dormId);
  const dormitoryLocationSegment = await findDormitoryLocationSegment(dormId);
  const dormitoryRoomSegment = await findDormitoryRoomSegment(dormId);

  const validRole = validator.isValidRole(userData.role, "owner");

  const validationResult = dormitorySwitchValidator(
    userData,
    dormitoryData,
    validRole,
    dormitoryAmenitySegment,
    dormitoryDocumentSegment,
    dormitoryLocationSegment,
    dormitoryLandmarkSegment,
    dormitoryRoomSegment
  );
  if (validationResult !== null)
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });

  const t = await db.sequelize.transaction();
  try {
    await db.Dormitory.update(
      { isAccepting },
      { where: { id: dormitoryData.id } },
      { transaction: t }
    );
    await t.commit();

    return res.send({
      msg: "Your dormitory availability status has been updated",
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.displayAllDormitories = async (req, res) => {
  const filter1 = req.query.filter1;
  const filter2 = req.query.filter2;

  try {
    if (filter1 === "all") {
      const dormitories = await db.Dormitory.findAll({
        where: {
          [Op.and]: [
            { isVerified: { [Op.eq]: true } },
            { isAccepting: { [Op.eq]: true } },
            { isPayed: { [Op.eq]: true } },
          ],
        },
        include: [
          db.DormProfileImage,
          db.User,
          db.DormProfileImage,
          db.DormRating,
          db.DormLocation,
        ],
      });

      return res.status(200).send({ dormitories });
    } else if (filter1 !== "all") {
      const dormitories = await db.Dormitory.findAll({
        where: {
          [Op.and]: [
            { isVerified: { [Op.eq]: true } },
            { isAccepting: { [Op.eq]: true } },
            { isPayed: { [Op.eq]: true } },
            getValue(filter1, filter2),
          ],
        },
        include: [
          { model: Room },
          db.DormProfileImage,
          db.User,
          db.DormProfileImage,
          db.DormRating,
          db.DormLocation,
        ],
      });

      return res.status(200).send({ dormitories });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.displayOwnerDormitories = async (req, res) => {
  const userData = req.user;
  const validRole = validator.isValidRole(userData.role, "owner");

  if (validRole !== true) {
    return res.status(401).send({ msg: "Invalid User" });
  }

  try {
    const userDormitories = await db.Dormitory.findAll({
      where: { userId: userData.id },
      include: [
        db.DormProfileImage,
        db.User,
        db.DormProfileImage,
        db.DormRating,
        db.DormLocation,
        db.Reservation
      ],
    });

    return res.status(200).send({ userDormitories });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.searchDormitory = async (req, res) => {
  const search = req.query.search;

  try {
    const dormitoryResults = await db.Dormitory.findAll({
      where: {
        isVerified: true,
        isAccepting: true,
        isPayed: true,
        [Op.or]: [
          { name: { [Op.iLike]: "%" + search + "%" } },
          { "$Landmarks.name$": { [Op.iLike]: "%" + search + "%" } },
          { address: { [Op.iLike]: "%" + search + "%" } },
        ],
      },
      include: [
        { model: Landmark },
        db.DormProfileImage,
        db.User,
        db.DormProfileImage,
        db.DormRating,
        db.DormLocation,
      ],
    });

    return res.status(200).send({ msg: "Search Results", dormitoryResults });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.getDormitoriesByUserReservation = async (req, res) => {
  const reservationId = req.params.reservationId;

  const userData = req.user;
  const reservationData = await findReservationData(reservationId);
  const validRole = validator.isValidRole(userData.role, "tenant");

  const validationResult = getDormitoriesByUserReservationValidator(
    userData,
    reservationData,
    validRole
  );
  if (validationResult !== null) {
    return res
      .status(validationResult.statusCode)
      .send({ msg: validationResult.message });
  }

  try {
    const dormitoryData = await db.Dormitory.findOne({
      where: { id: reservationData.dormitoryId },
      include: [
        db.DormProfileImage,
        db.User,
        db.DormProfileImage,
        db.DormRating,
        db.DormLocation,
        db.RatingAve
      ],
    });

    return res.send({ dormitoryData });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "Something went wrong" });
  }
};
