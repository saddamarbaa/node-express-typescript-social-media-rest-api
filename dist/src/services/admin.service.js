"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersService = void 0;
const http_errors_1 = require("http-errors");
const User_model_1 = __importDefault(require("@src/models/User.model"));
const utils_1 = require("@src/utils");
const getUsersService = async (req, res, next) => {
    try {
        const users = await User_model_1.default.find().select('name firstName lastName  surname email dateOfBirth gender joinedDate isVerified  profileImage  mobileNumber  status role  companyName   acceptTerms nationality  favoriteAnimal  address  profileImage  bio mobileNumber createdAt updatedAt');
        const data = {
            user: users,
        };
        return res.status(200).json((0, utils_1.response)({
            data,
            success: true,
            error: false,
            message: `Success`,
            status: 200,
        }));
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
};
exports.getUsersService = getUsersService;
exports.default = {
    getUsersService: exports.getUsersService,
};
//# sourceMappingURL=admin.service.js.map