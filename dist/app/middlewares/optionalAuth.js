"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = optionalAuth;
const config_1 = __importDefault(require("../../config"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        req.user = null;
        return next();
    }
    try {
        const decoded = jwtHelpers_1.jwtHelpers.verifyToken(authHeader, config_1.default.jwt.secret);
        if (typeof decoded === "object" &&
            decoded !== null &&
            "userId" in decoded &&
            "role" in decoded) {
            req.user = {
                id: decoded.userId,
                role: decoded.role,
            };
        }
        else {
            req.user = null;
        }
    }
    catch (err) {
        req.user = null;
    }
    next();
}
