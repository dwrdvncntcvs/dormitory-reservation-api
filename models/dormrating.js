"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DormRating extends Model {
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
        hooks: true,
        targetKey: "id",
      });

      this.belongsTo(models.User, { 
        foreignKey: {
          name: "userId", 
          allowNull: false
        },
        onDelete: "CASCADE",
        hooks: true,
        targetKey: "id",
      });
    }
  }
  DormRating.init(
    {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dormitoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DormRating",
    }
  );
  return DormRating;
};
