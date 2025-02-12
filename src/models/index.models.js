// models/index.models.js
import Role from './Role.js';
import Deposito from './Deposito.js';
import Sucursal from './Sucursal.js';
import User from './User.js';
import RepartidorSucursal from './RepartidorSucursal.js';
import Estado from './Estado.js';
import Remito from './Remito.js';
import Bulto from './Bulto.js';
import Observation from './Observation.js';
import RouteSheet from './RouteSheet.js';
import QRCode from './QRCode.js';
import TiposBulto from './TiposBulto.js';

// Asociaciones de Users
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
User.belongsTo(Deposito, { foreignKey: 'deposito_id', as: 'deposito' });
User.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });

// Relación muchos-a-muchos entre repartidores (User) y sucursales
User.belongsToMany(Sucursal, {
  through: RepartidorSucursal,
  foreignKey: 'user_id',
  as: 'repartidorSucursales'
});
Sucursal.belongsToMany(User, {
  through: RepartidorSucursal,
  foreignKey: 'sucursal_id',
  as: 'repartidores'
});

// Asociaciones de RouteSheet
RouteSheet.belongsTo(Estado, { foreignKey: 'estado_id', as: 'estado' });
RouteSheet.belongsTo(Deposito, { foreignKey: 'deposito_id', as: 'deposito' });
RouteSheet.belongsTo(User, { foreignKey: 'created_by', as: 'creadoPor' });
RouteSheet.belongsTo(User, { foreignKey: 'repartidor_id', as: 'repartidor' });
RouteSheet.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
// Eliminamos la asociación antigua con Remito y definimos la nueva relación uno a muchos:
RouteSheet.hasMany(Remito, { foreignKey: 'routeSheet_id', as: 'remitos' });
RouteSheet.hasMany(Bulto, { foreignKey: 'route_sheet_id', as: 'bultos' });
RouteSheet.hasMany(Observation, { foreignKey: 'route_sheet_id', as: 'observaciones' });

// Asociaciones de Remito
// Cada Remito pertenece a un RouteSheet mediante la clave foránea "routeSheet_id"
Remito.belongsTo(RouteSheet, { foreignKey: 'routeSheet_id', as: 'routeSheet' });

// Asociaciones de Bulto
Bulto.belongsTo(RouteSheet, { foreignKey: 'route_sheet_id', as: 'routeSheet' });

// Asociaciones de Observation
Observation.belongsTo(RouteSheet, { foreignKey: 'route_sheet_id', as: 'routeSheet' });
Observation.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Observation, { foreignKey: 'sucursal_id', as: 'observaciones' });

// Relaciones para QRCode y TiposBulto
QRCode.belongsTo(TiposBulto, { foreignKey: 'tipo_bulto_id', as: 'tipoBulto' });
TiposBulto.hasMany(QRCode, { foreignKey: 'tipo_bulto_id', as: 'qrcodes' });
QRCode.belongsTo(Deposito, { foreignKey: 'deposito_id', as: 'deposito' });

// Exportar todos los modelos
export {
  Role,
  Deposito,
  Sucursal,
  User,
  RepartidorSucursal,
  Estado,
  Remito,
  Bulto,
  Observation,
  RouteSheet,
  QRCode,
  TiposBulto
};
