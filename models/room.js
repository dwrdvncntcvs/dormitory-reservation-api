'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Dormitory, {foreignKey: 'dormitoryId', onDelete: 'CASCADE' , targetKey: 'id'}); //To be fixed soon
      this.hasOne(models.RoomPayment, {foreignKey: 'roomId'});
    }
  };
  Room.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activeTenant: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dormitoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};