"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Question, {
        foreignKey: { name: "questionId", allowNull: false },
        hooks: true,
        onDelete: "CASCADE",
        targetKey: "id",
      });

      this.belongsTo(models.Dormitory, {
        foreignKey: { name: "dormitoryId", allowNull: false },
        hooks: true,
        onDelete: "CASCADE",
        targetKey: "id",
      });

      this.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        hooks: true,
        onDelete: "CASCADE",
        targetKey: "id",
      });
    }
  }
  Comment.init(
    {
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      commenter: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dormitoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionId: {
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
      modelName: "Comment",
    }
  );
  return Comment;
};
