// models/Estado.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Estado extends Model {}

Estado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'Estado',
    tableName: 'Estados',
    timestamps: false
  }
);

export default Estado;
