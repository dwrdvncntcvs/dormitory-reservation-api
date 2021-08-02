'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Room, {foreignKey: 'roomId', onDelete: 'CASCADE' , targetKey: 'id'});
      this.belongsTo(models.Dormitory, {foreignKey: 'dormitoryId', onDelete: 'CASCADE' , targetKey: 'id'});
    }
  };
  RoomPayment.init({
    roomCost: {
      type: DataTypes.DECIMAL(16,2),
      allowNull: false,
    },
    electricBill: {
      type: DataTypes.DECIMAL(16,2),
      allowNull: true
    },
    waterBill: {
      type: DataTypes.DECIMAL(16,2),
      allowNull: true
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dormitoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'RoomPayment',
  });
  return RoomPayment;
};