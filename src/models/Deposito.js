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
    codigo: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: true
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
