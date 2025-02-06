// models/TiposBulto.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class TiposBulto extends Model {}

TiposBulto.init(
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
    codigo: {
      type: DataTypes.STRING(4),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'TiposBulto',
    tableName: 'TiposBulto',
    timestamps: false
  }
);

export default TiposBulto;
