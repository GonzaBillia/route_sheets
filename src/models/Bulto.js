// models/Bulto.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Bulto extends Model {}

Bulto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    route_sheet_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Bulto',
    tableName: 'Bulto',
    timestamps: false
  }
);

export default Bulto;
