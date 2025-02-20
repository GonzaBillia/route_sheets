'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BultoRouteSheet', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bulto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Bulto', // Nombre de la tabla Bulto
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      route_sheet_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'RouteSheet', // Nombre de la tabla RouteSheet
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BultoRouteSheet');
  }
};
