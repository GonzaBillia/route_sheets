// models/Sucursal.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Sucursal extends Model {}

Sucursal.init(
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
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20)
    }
  },
  {
    sequelize,
    modelName: 'Sucursal',
    tableName: 'Sucursal',
    timestamps: false
  }
);

export default Sucursal;
