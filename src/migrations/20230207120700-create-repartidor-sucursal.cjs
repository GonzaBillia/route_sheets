'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RepartidorSucursal', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      sucursal_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RepartidorSucursal');
  }
};
