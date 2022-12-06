"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = exports.sendVerificationMailValidation = exports.refreshTokenValidation = exports.verifyUserMailValidation = exports.updateUserValidation = exports.loginUserValidation = exports.signupUserValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("../validator"));
const userSchema_1 = require("./userSchema");
const signupUserValidation = (req, res, next) => (0, validator_1.default)(userSchema_1.userSchema.signupUser, req.body, next);
exports.signupUserValidation = signupUserValidation;
const loginUserValidation = (req, res, next) => (0, validator_1.default)(userSchema_1.userSchema.loginUser, req.body, next);
exports.loginUserValidation = loginUserValidation;
const updateUserValidation = (req, res, next) => (0, validator_1.default)(userSchema_1.userSchema.updateUser, req.body, next);
exports.updateUserValidation = updateUserValidation;
const verifyUserMailValidation = (req, res, next) => {
    console.log(mongoose_1.default.Types.ObjectId.isValid(req.params.userId));
    return (0, validator_1.default)(userSchema_1.userSchema.verifyUserMail, req.params, next);
};
exports.verifyUserMailValidation = verifyUserMailValidation;
const refreshTokenValidation = (req, res, next) => (0, validator_1.default)(userSchema_1.userSchema.refreshToken, req.body, next);
exports.refreshTokenValidation = refreshTokenValidation;
const sendVerificationMailValidation = (req, res, next) => (0, validator_1.default)(userSchema_1.userSchema.sendVerificationMail, req.body, next);
exports.sendVerificationMailValidation = sendVerificationMailValidation;
const resetPasswordValidation = (req, res, next) => (0, validator_1.default)(userSchema_1.userSchema.resetPassword, { ...req.body, ...req.params }, next);
exports.resetPasswordValidation = resetPasswordValidation;
//# sourceMappingURL=userValidation.js.map