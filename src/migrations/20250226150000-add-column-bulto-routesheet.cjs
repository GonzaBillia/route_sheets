'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('BultoRouteSheet', 'delivered_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('RouteSheet', 'received_incomplete_at', {
        type: Sequelize.DATE,
        allowNull: true
      });

    await queryInterface.addColumn('BultoRouteSheet', 'received', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('Sucursal', 'codigo', {
        type: Sequelize.STRING(10),
        allowNull: true
      });

    await queryInterface.removeColumn('Bulto', 'recibido');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('BultoRouteSheet', 'delivered_at');
    await queryInterface.removeColumn('RouteSheet', 'received_incomplete_at');
    await queryInterface.removeColumn('BultoRouteSheet', 'received');
    await queryInterface.removeColumn('Sucursal', 'codigo');

    await queryInterface.addColumn('Bulto', 'recibido', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      });
  }
};
