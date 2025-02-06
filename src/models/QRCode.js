// models/QRCode.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class QRCode extends Model {}

QRCode.init(
  {
    // Usamos "codigo" como primary key en lugar de un id autoincremental
    codigo: {
      type: DataTypes.STRING(12),
      primaryKey: true
    },
    qr_base64: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bulto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Bulto',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    // En lugar de "tipo_bulto", ahora referenciamos el id de la tabla TiposBulto
    tipo_bulto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TiposBulto',
        key: 'id'
      },
      onDelete: 'RESTRICT'
    }
  },
  {
    sequelize,
    modelName: 'QRCode',
    tableName: 'QRCode',
    timestamps: false
  }
);

export default QRCode;
