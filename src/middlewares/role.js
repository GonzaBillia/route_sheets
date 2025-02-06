// middleware/role.js
import ERROR from "../constants/errors.js";
import { errorResponse } from "../utils/handlers/responseHandler.js";

export const accessMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;
    
    // Si el rol del usuario no está en la lista de roles permitidos, se deniega el acceso.
    if (!allowedRoles.includes(role)) {
      return errorResponse(res, ERROR.ROLE_NOT_ALLOWED, 403);
    }
    
    next();
  };
};
