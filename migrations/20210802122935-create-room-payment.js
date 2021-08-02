'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RoomPayments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomCost: {
        type: Sequelize.DECIMAL(16,2)
      },
      electricBill: {
        type: Sequelize.DECIMAL(16,2)
      },
      waterBill: {
        type: Sequelize.DECIMAL(16,2)
      },
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dormitoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('RoomPayments');
  }
};