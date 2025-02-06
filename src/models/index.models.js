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
RouteSheet.belongsTo(Remito, { foreignKey: 'remito_id', as: 'remito' });
RouteSheet.hasMany(Bulto, { foreignKey: 'route_sheet_id', as: 'bultos' });
RouteSheet.hasMany(Observation, { foreignKey: 'route_sheet_id', as: 'observaciones' });

// Asociaciones de Bulto
Bulto.belongsTo(RouteSheet, { foreignKey: 'route_sheet_id', as: 'routeSheet' });

// Asociaciones de Observation
Observation.belongsTo(RouteSheet, { foreignKey: 'route_sheet_id', as: 'routeSheet' });
Observation.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Observation, { foreignKey: 'sucursal_id', as: 'observaciones' });

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
  RouteSheet
};
