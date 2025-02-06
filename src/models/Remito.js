// models/Remito.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

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
