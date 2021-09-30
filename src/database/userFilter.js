const { Op } = require("sequelize");

exports.getValue = (filter, role) => {
  if (filter === "?") {
    return;
  } else if (filter !== "?") {
    const value = {
      [Op.and]: [{ isVerified: { [Op.eq]:filter } }, { role: { [Op.eq]:role } }],
    };

    return value;
  }
};
