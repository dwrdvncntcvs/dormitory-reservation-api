"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
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

      this.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
        hooks: true,
        targetKey: "id",
      });
    }
  }
  Question.init(
    {
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      questioner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
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
      modelName: "Question",
    }
  );
  return Question;
};
