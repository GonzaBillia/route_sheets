import ERROR from "../constants/errors.js";
import { errorResponse } from "../utils/handlers/responseHandler.js";

export const accessMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const { role, branchId } = req.user;

        // 🔹 Si el usuario no tiene un rol permitido, denegar acceso
        if (!allowedRoles.includes(role)) {
            return errorResponse(res, ERROR.ROLE_NOT_ALLOWED, 403);
        }

        // 🔹 Si es un supervisor, debe tener una sucursal asignada
        if (role === "supervisor") {
            if (!branchId) {
                return errorResponse(res, ERROR.BRANCH_REQUIRED, 403);
            }
            req.branchId = branchId; // Almacena la sucursal del supervisor en `req`
        }

        next();
    };
};
