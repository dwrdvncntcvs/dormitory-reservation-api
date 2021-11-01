const { Op } = require("sequelize");

exports.getValue = (filter1, filter2) => {
    if (filter1 !== '?' && filter2 !== '?') {
      const value = { "$Rooms.roomCost$": { [Op.between]: [filter1, filter2] } };
  
      return value;
    }
    else if (filter1 !== '?' && filter2 === '?') {
      const value = { allowedGender: { [Op.eq]: filter1 } };
  
      return value;
    }
  };