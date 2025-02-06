import ERROR from "../constants/errors.js";
import { errorResponse } from "../utils/handlers/responseHandler.js";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return errorResponse(res, ERROR.UNAUTHORIZED, 401);

    const decoded = verifyToken(token);
    if (!decoded) return errorResponse(res, ERROR.TOKEN_MISSING, 403);

    req.user = decoded;
    next();
};
