"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const custom_environment_variables_config_1 = require("@src/configs/custom-environment-variables.config");
const isAdmin = async (req, res, next) => {
    const user = req?.user;
    const adminUser = user && user.role === custom_environment_variables_config_1.environmentConfig.ADMIN_ROLE && custom_environment_variables_config_1.environmentConfig?.ADMIN_EMAIL?.includes(`${user?.email}`);
    if (!adminUser) {
        return next((0, http_errors_1.default)(403, `Auth Failed (Unauthorized)`));
    }
    next();
};
exports.isAdmin = isAdmin;
exports.default = { isAdmin: exports.isAdmin };
//# sourceMappingURL=checkIsAdmin.js.map