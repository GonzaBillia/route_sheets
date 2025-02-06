// models/Observation.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Observation extends Model {}

Observation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    route_sheet_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sucursal_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Observation',
    tableName: 'Observation',
    timestamps: false
  }
);

export default Observation;
