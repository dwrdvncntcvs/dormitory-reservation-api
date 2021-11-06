"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RatingAve extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Dormitory, {
        foreignKey: {
          name: "dormitoryId",
          allowNull: false,
        },
        onDelete: "CASCADE",
        targetKey: "id",
        hooks: true,
      });
    }
  }
  RatingAve.init(
    {
      dormitoryId: { type: DataTypes.INTEGER, allowNull: false },
      totalRating: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "RatingAve",
    }
  );
  return RatingAve;
};
