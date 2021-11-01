'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      activeTenant: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      roomCost: {
        type: Sequelize.DECIMAL(16,2),
        get() {
          const value = this.getDataValue('roomCost');
          return value === null ? null : parseFloat(value);
        }
      },
      electricBill: {
        type: Sequelize.DECIMAL(16,2),
        get() {
          const value = this.getDataValue('electricBill');
          return value === null ? null : parseFloat(value);
        }
      },
      waterBill: {
        type: Sequelize.DECIMAL(16,2),
        get() {
          const value = this.getDataValue('waterBill');
          return value === null ? null : parseFloat(value);
        }
      },
      dormitoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Dormitories",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Rooms');
  }
};