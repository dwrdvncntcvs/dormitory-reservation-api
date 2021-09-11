"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Landmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Dormitory, {
        foreignKey: { name: "dormitoryId", allowNull: false },
        onDelete: "CASCADE",
        hooks: true,
        targetKey: "id",
      });
    }
  }
  Landmark.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dormitoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Landmark",
    }
  );
  return Landmark;
};
