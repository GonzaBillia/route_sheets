'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RouteSheet', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      codigo: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      estado_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      received_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deposito_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      repartidor_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sucursal_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      remito_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RouteSheet');
  }
};
