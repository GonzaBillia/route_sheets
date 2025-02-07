'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('QRCode', {
      codigo: {
        type: Sequelize.STRING(12),
        primaryKey: true
      },
      qr_base64: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      serial: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      deposito_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      bulto_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      tipo_bulto_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
    // Agregar constraint para deposito_id
    await queryInterface.addConstraint('QRCode', {
      fields: ['deposito_id'],
      type: 'foreign key',
      name: 'fk_qrcode_deposito',
      references: {
        table: 'Deposito',
        field: 'id'
      },
      onDelete: 'RESTRICT'
    });
    // Agregar constraint para bulto_id
    await queryInterface.addConstraint('QRCode', {
      fields: ['bulto_id'],
      type: 'foreign key',
      name: 'fk_qrcode_bulto',
      references: {
        table: 'Bulto',
        field: 'id'
      },
      onDelete: 'SET NULL'
    });
    // Agregar constraint para tipo_bulto_id
    await queryInterface.addConstraint('QRCode', {
      fields: ['tipo_bulto_id'],
      type: 'foreign key',
      name: 'fk_qrcode_tipo_bulto',
      references: {
        table: 'TiposBulto',
        field: 'id'
      },
      onDelete: 'RESTRICT'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('QRCode');
  }
};
