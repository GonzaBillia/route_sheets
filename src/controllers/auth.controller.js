// controllers/auth.controller.js
import { registerUser, loginUser, getUserInfo, getAllUsers, getRepartidores, deleteUser, updateUser } from "../services/auth.service.js";
import { successResponse, errorResponse } from "../utils/handlers/responseHandler.js";
import SUCCESS from "../constants/success.js";
import ERROR from "../constants/errors.js";
import { asyncHandler } from "../utils/handlers/asyncHandler.js";

// Registro (Solo Superadmin)
export const register = asyncHandler(async (req, res) => {
  try {
    // Se utiliza req.user.role (proveniente del token) para validar que el usuario es superadmin
    const user = await registerUser(req.user.role, req.body);
    return successResponse(res, SUCCESS.USER_CREATED, user, 201);
  } catch (error) {
    return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500, error);
  }
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return errorResponse(res, ERROR.MISSING_FIELDS, 400);
  }
  
  try {
    const { token, user } = await loginUser(email, password);
    
    // Establecer la cookie con el token JWT
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS en producción
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });
    
    return successResponse(res, SUCCESS.LOGIN_SUCCESS, { user });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
  }
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    
    // Opcional: invalidar la sesión si se usa una estrategia basada en sesiones
    req.user = null;
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("❌ Error al destruir la sesión:", err);
          return errorResponse(res, ERROR.OPERATION_FAILED, 500);
        }
      });
    }
    
    return successResponse(res, SUCCESS.LOGOUT_SUCCES, true, 201);
  } catch (error) {
    console.error("❌ Error en logout:", error);
    return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
  }
});

// Obtener información del usuario (getInfo)
export const getInfo = asyncHandler(async (req, res) => {
  try {
    // Obtener la información completa del usuario desde el servicio, 
    // usando el id del usuario en req.user
    const userInfo = await getUserInfo(req.user.id);
    return successResponse(res, SUCCESS.DATA_RETRIEVED, { user: userInfo });
  } catch (error) {
    return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
  }
});

export const getUsers = asyncHandler(async (req, res) => {
  try {
    // Obtener la información completa del usuario desde el servicio, 
    // usando el id del usuario en req.user
    const users = await getAllUsers();
    return successResponse(res, SUCCESS.DATA_RETRIEVED, users);
  } catch (error) {
    return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
  }
})

export const getRepartidoresController = asyncHandler(async (req, res) => {
  try {
    // Se llama al servicio para obtener los usuarios con role "repartidor"
    const repartidores = await getRepartidores();
    return successResponse(res, SUCCESS.DATA_RETRIEVED, repartidores);
  } catch (error) {
    return errorResponse(res, error.message || ERROR.OPERATION_FAILED, error.status || 500);
  }
});

export const updateUserController = asyncHandler(async (req, res) => {

  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    return successResponse(res, "Usuario actualizado correctamente", updatedUser);
  } catch (err) {
    return errorResponse(res, err.message);
  }
});

export const deleteUserController = asyncHandler(async (req, res) => {
  try {
    await deleteUser(req.params.id);
    return successResponse(res, "Usuario eliminado correctamente");
  } catch (err) {
    return errorResponse(res, err.message);
  }
});