// models/RepartidorSucursal.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class RepartidorSucursal extends Model {}

RepartidorSucursal.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    sucursal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  },
  {
    sequelize,
    modelName: 'RepartidorSucursal',
    tableName: 'RepartidorSucursal',
    timestamps: false
  }
);

export default RepartidorSucursal;
