import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class RouteSheet extends Model {}

RouteSheet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    estado_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    received_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Nueva columna para indicar recepción incompleta
    received_incomplete_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deposito_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    repartidor_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sucursal_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'RouteSheet',
    tableName: 'RouteSheet',
    timestamps: false
  }
);

export default RouteSheet;
