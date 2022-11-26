"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const User_model_1 = __importDefault(require("@src/models/User.model"));
const utils_1 = require("@src/utils");
const custom_environment_variables_config_1 = require("@src/configs/custom-environment-variables.config");
const isAdmin = async (req, res, next) => {
    try {
        const user = await User_model_1.default.findOne({ _id: req?.user?.userId });
        const adminUser = user && user.role === custom_environment_variables_config_1.environmentConfig.ADMIN_ROLE && custom_environment_variables_config_1.environmentConfig?.ADMIN_EMAIL?.includes(`${user?.email}`);
        if (!adminUser) {
            return res.status(403).send((0, utils_1.response)({
                data: null,
                success: false,
                error: true,
                message: 'Auth Failed (Unauthorized)!',
                status: 403,
            }));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(error);
    }
};
exports.isAdmin = isAdmin;
exports.default = { isAdmin: exports.isAdmin };
//# sourceMappingURL=checkIsAdmin.js.map