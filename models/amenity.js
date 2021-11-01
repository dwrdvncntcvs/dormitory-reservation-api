"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Amenity extends Model {
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
  Amenity.init(
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
      modelName: "Amenity",
      tableName: "Amenities",
    }
  );
  return Amenity;
};
