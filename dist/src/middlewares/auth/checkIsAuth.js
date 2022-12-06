"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importStar(require("http-errors"));
const User_model_1 = __importDefault(require("@src/models/User.model"));
const custom_environment_variables_config_1 = require("@src/configs/custom-environment-variables.config");
const isAuth = async (req, res, next) => {
    const authHeader = (req && req.headers.authorization) || (req && req.headers.Authorization);
    const token = (authHeader && authHeader.split(' ')[1]) || req?.cookies?.authToken || '';
    if (!token) {
        return next((0, http_errors_1.default)(401, 'Auth Failed (Invalid Credentials)'));
    }
    jsonwebtoken_1.default.verify(token, custom_environment_variables_config_1.environmentConfig.ACCESS_TOKEN_SECRET_KEY, async (err, decodedUser) => {
        if (err) {
            const errorMessage = err.name === 'JsonWebTokenError' ? 'Auth Failed (Unauthorized)' : err.message;
            return next((0, http_errors_1.default)(403, errorMessage));
        }
        try {
            const decodedUserInDB = await User_model_1.default.findOne({ _id: decodedUser?.userId });
            if (!decodedUserInDB) {
                return next((0, http_errors_1.default)(403, `Auth Failed (Unauthorized)`));
            }
            req.user = decodedUserInDB;
            next();
        }
        catch (error) {
            return next(http_errors_1.InternalServerError);
        }
    });
};
exports.isAuth = isAuth;
exports.default = { isAuth: exports.isAuth };
//# sourceMappingURL=checkIsAuth.js.map