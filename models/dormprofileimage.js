"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DormProfileImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.DormProfileImage, {
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
  DormProfileImage.init(
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      filepath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mimetype: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DormProfileImage",
    }
  );
  return DormProfileImage;
};
