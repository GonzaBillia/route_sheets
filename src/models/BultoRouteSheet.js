import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class BultoRouteSheet extends Model {}

BultoRouteSheet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    bulto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Bulto',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    route_sheet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'RouteSheet',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    // Fecha en la que se realizó la asignación
    assigned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    // Indicador de si es la asignación actual
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    // Nueva columna para la fecha de entrega
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Nueva columna para indicar si se recibió
    received: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'BultoRouteSheet',
    tableName: 'BultoRouteSheet',
    timestamps: false
  }
);

export default BultoRouteSheet;
