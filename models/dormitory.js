"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dormitory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false
        },
        onDelete: "CASCADE",
        targetKey: "id",
        hooks: true
      });

      this.hasOne(models.DormProfileImage, { foreignKey: "dormitoryId" });

      this.hasMany(models.DormDocument, { foreignKey: "dormitoryId" });

      this.hasMany(models.Room, { foreignKey: "dormitoryId" });

      this.hasMany(models.DormImage, { foreignKey: "dormitoryId" });

      this.hasMany(models.Reservation, { foreignKey: "dormitoryId"});
    }
  }
  Dormitory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isAccepting: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Dormitory",
      tableName: "Dormitories",
    }
  );
  return Dormitory;
};
