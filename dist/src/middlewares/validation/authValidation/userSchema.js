"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joi_objectid_1 = __importDefault(require("joi-objectid"));
const vaildObjectId = (0, joi_objectid_1.default)(joi_1.default);
exports.userSchema = {
    signupUser: joi_1.default.object({
        name: joi_1.default.string().min(3).max(15).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().required().valid(joi_1.default.ref('password')),
        firstName: joi_1.default.string().min(3).max(15),
        lastName: joi_1.default.string().min(3).max(15),
        familyName: joi_1.default.string().min(3).max(15),
        companyName: joi_1.default.string(),
        dateOfBirth: joi_1.default.string(),
        mobileNumber: joi_1.default.string(),
        gender: joi_1.default.string(),
        profileImage: joi_1.default.string(),
        role: joi_1.default.string(),
        favoriteAnimal: joi_1.default.string(),
        nationality: joi_1.default.string(),
        isVerified: joi_1.default.boolean(),
        isDeleted: joi_1.default.boolean(),
        status: joi_1.default.string(),
        bio: joi_1.default.string().min(10).max(300),
        jobTitle: joi_1.default.string().min(2).max(300),
        address: joi_1.default.string(),
        acceptTerms: joi_1.default.boolean(),
        confirmationCode: joi_1.default.string(),
    }),
    loginUser: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
    }),
    updateUser: joi_1.default.object({
        name: joi_1.default.string().min(3).max(15),
        email: joi_1.default.string().email(),
        firstName: joi_1.default.string().min(3).max(15),
        lastName: joi_1.default.string().min(3).max(15),
        familyName: joi_1.default.string().min(3).max(15),
        companyName: joi_1.default.string(),
        dateOfBirth: joi_1.default.string(),
        mobileNumber: joi_1.default.string(),
        gender: joi_1.default.string(),
        profileImage: joi_1.default.string(),
        role: joi_1.default.string(),
        favoriteAnimal: joi_1.default.string(),
        nationality: joi_1.default.string(),
        isVerified: joi_1.default.boolean(),
        isDeleted: joi_1.default.boolean(),
        status: joi_1.default.string(),
        bio: joi_1.default.string().min(10).max(300),
        jobTitle: joi_1.default.string().min(2).max(300),
        address: joi_1.default.string(),
        acceptTerms: joi_1.default.boolean(),
        confirmationCode: joi_1.default.string(),
    }),
    verifyUserMail: joi_1.default.object({
        token: joi_1.default.string().min(3).max(300).required(),
        userId: vaildObjectId().required(),
    }),
    refreshToken: joi_1.default.object({
        refreshToken: joi_1.default.string().min(3).max(300).required(),
    }),
    sendVerificationMail: joi_1.default.object({
        email: joi_1.default.string().email().required(),
    }),
    resetPassword: joi_1.default.object({
        token: joi_1.default.string().min(3).max(300).required(),
        userId: vaildObjectId().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().required().valid(joi_1.default.ref('password')),
    }),
};
exports.default = exports.userSchema;
//# sourceMappingURL=userSchema.js.map