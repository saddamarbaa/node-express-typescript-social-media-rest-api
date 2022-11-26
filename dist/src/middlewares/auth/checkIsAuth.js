"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("@src/utils");
const custom_environment_variables_config_1 = require("@src/configs/custom-environment-variables.config");
const isAuth = (req, res, next) => {
    const authHeader = (req && req.headers.authorization) || (req && req.headers.Authorization);
    const token = (authHeader && authHeader.split(' ')[1]) || req?.cookies?.authToken || '';
    if (!token) {
        return res.status(401).send((0, utils_1.response)({
            data: null,
            success: false,
            error: true,
            message: 'Auth Failed (Invalid Credentials)',
            status: 401,
        }));
    }
    jsonwebtoken_1.default.verify(token, custom_environment_variables_config_1.environmentConfig.ACCESS_TOKEN_SECRET_KEY, (err, decodedUser) => {
        if (err) {
            const errorMessage = err.name === 'JsonWebTokenError' ? 'Auth Failed (Unauthorized)' : err.message;
            return res.status(403).send((0, utils_1.response)({
                data: null,
                success: false,
                error: true,
                message: errorMessage,
                status: 403,
            }));
        }
        req.user = decodedUser;
        next();
    });
};
exports.isAuth = isAuth;
exports.default = { isAuth: exports.isAuth };
//# sourceMappingURL=checkIsAuth.js.map