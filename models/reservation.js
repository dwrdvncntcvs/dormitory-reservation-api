"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Room, {
        foreignKey: {
          name: "roomId",
          allowNull: false,
        },
        onDelete: "CASCADE",
        targetKey: "id",
        hooks: true,
      });

      this.belongsTo(models.Dormitory, {
        foreignKey: {
          name: "dormitoryId",
          allowNull: false,
        },
        onDelete: "CASCADE",
        targetKey: "id",
        hooks: true,
      });

      this.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        onDelete: "CASCADE",
        targetKey: "id",
        hooks: true,
      });
    }
  }
  Reservation.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAccepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      roomName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomSlot: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isCancelled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Reservation",
      tableName: "Reservations",
    }
  );
  return Reservation;
};
