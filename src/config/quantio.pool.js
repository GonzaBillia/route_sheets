// db/mysqlPool.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST ,      // Dirección del servidor MySQL
  user: process.env.MYSQL_USER ,   
  port: process.env.MYSQL_PORT ,    // Usuario de la base de datos
  password: process.env.MYSQL_PASSWORD , // Contraseña del usuario
  database: process.env.MYSQL_DATABASE , // Nombre de la base de datos
  waitForConnections: true,
  connectionLimit: 10,   // Número máximo de conexiones simultáneas
  queueLimit: 0,
});

export default pool;
