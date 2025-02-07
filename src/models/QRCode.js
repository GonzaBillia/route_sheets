import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class QRCode extends Model {}

QRCode.init(
  {
    // Código armado único (ejemplo: "DP-CA-000001"), se utiliza como primary key
    codigo: {
      type: DataTypes.STRING(12),
      primaryKey: true
    },
    qr_base64: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Nuevo campo serial: número entero (6 dígitos formateado en la lógica de negocio)
    serial: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // Nuevo campo deposito_id: clave foránea que referencia a Deposito (columna 'id')
    deposito_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Deposito',
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    // bulto_id: opcional, se asocia al bulto cuando se asigna
    bulto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Bulto',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    // tipo_bulto_id: referencia al id de la tabla TiposBulto
    tipo_bulto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TiposBulto',
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    // Nuevo campo created_at para filtrar por fecha de creación
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
