// services/auth.service.js
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import dotenv from "dotenv";
import { User, Role } from "../models/index.models.js";
import ERROR from "../constants/errors.js";

dotenv.config();

// Registro de un nuevo usuario (solo superadmin puede registrar)
export const registerUser = async (adminRole, { username, email, password, role, deposito_id, sucursal_id }) => {
  // Solo superadmin puede registrar nuevos usuarios
  if (adminRole !== "superadmin") {
    throw { status: 403, message: ERROR.INSUFFICIENT_PERMISSIONS };
  }

  // Validaciones según el rol a crear
  if (role === "deposito" && !deposito_id) {
    throw { status: 400, message: "El identificador del depósito es obligatorio para usuarios de tipo 'deposito'" };
  }
  if (role === "sucursal" && !sucursal_id) {
    throw { status: 400, message: "El identificador de la sucursal es obligatorio para usuarios de tipo 'sucursal'" };
  }
  if (role === "repartidor") {
    deposito_id = null;
    sucursal_id = null;
  }

  // Verificar si ya existe un usuario con el mismo email
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw { status: 409, message: ERROR.EMAIL_ALREADY_REGISTERED };
  }

  // Buscar el registro del rol en la tabla Roles
  const roleRecord = await Role.findOne({ where: { name: role } });
  if (!roleRecord) {
    throw { status: 400, message: ERROR.INVALID_REQUEST };
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password.trim(), 10);

  // Crear el usuario
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    role_id: roleRecord.id,
    deposito_id: deposito_id || null,
    sucursal_id: sucursal_id || null
  });

  return newUser;
};

// Login de usuario
export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: ERROR.MISSING_FIELDS };
  }

  // Buscar el usuario y cargar su rol asociado
  const user = await User.findOne({
    where: { email },
    include: [{ model: Role, as: 'role', attributes: ['name'] }]
  });
  if (!user) {
    console.error(`❌ Usuario no encontrado: ${email}`);
    throw { status: 400, message: ERROR.INVALID_CREDENTIALS };
  }

  // Comparar la contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.error(`❌ Contraseña incorrecta para: ${email}`);
    throw { status: 400, message: ERROR.INVALID_CREDENTIALS };
  }

  // Generar token JWT incluyendo el rol
  const token = generateToken({
    id: user.id,
    name: user.username,
    email: user.email,
    role: user.role ? user.role.name : null,
    deposito_id: user.deposito_id? user.deposito_id : null,
    sucursal_id: user.sucursal_id? user.sucursal_id : null
  });

  // Crear objeto seguro del usuario (sin contraseña)
  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role ? user.role.name : null,
    deposito_id: user.deposito_id? user.deposito_id : null,
    sucursal_id: user.sucursal_id? user.sucursal_id : null
  };

  return { token, user: safeUser };
};


// Servicio para obtener la información del usuario (sin contraseña)
export const getUserInfo = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
    include: [{ model: Role, as: 'role', attributes: ['name'] }]
  });
  if (!user) {
    throw { status: 404, message: ERROR.NOT_FOUND_USER };
  }
  return user;
};

export const getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};