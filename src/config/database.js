// src/config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from '../utils/path.js';
import pth from 'path'

// Define el archivo de entorno según el valor de NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// Carga las variables de entorno del archivo correspondiente
const envPath = pth.join(path.root, envFile);
dotenv.config({ path: envPath });

const DB_HOST = process.env.DB_HOST?.trim();
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT.trim()) : 3306;
const DB_NAME = process.env.DB_NAME?.trim();
const DB_USER = process.env.DB_USER?.trim();
const DB_PASS = process.env.DB_PASS?.trim();


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql', // Forzado a 'mysql'
  timezone: '-03:00',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});


export default sequelize;
