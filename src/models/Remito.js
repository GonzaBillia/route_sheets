// models/Remito.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import RouteSheet from './RouteSheet.js';

class Remito extends Model {}

Remito.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    external_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    routeSheet_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: RouteSheet, // o RouteSheet si ya lo has importado
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'Remito',
    tableName: 'Remito',
    timestamps: false
  }
);

export default Remito;
