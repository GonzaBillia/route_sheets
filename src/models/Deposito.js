// models/Deposito.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Deposito extends Model {}

Deposito.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.STRING(255)
    }
  },
  {
    sequelize,
    modelName: 'Deposito',
    tableName: 'Deposito',
    timestamps: false
  }
);

export default Deposito;
