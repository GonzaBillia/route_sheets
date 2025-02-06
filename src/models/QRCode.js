// models/QRCode.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class QRCode extends Model {}

QRCode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    codigo_deposito: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tipo_bulto: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    qr_base64: {
      type: DataTypes.TEXT,
      allowNull: true  // Campo opcional para almacenar la imagen en Base64
    },
    bulto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Bulto',
        key: 'id'
      },
      onDelete: 'SET NULL'
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
