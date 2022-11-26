"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const validator = async (schemaName, body, next) => {
    const value = await schemaName.validate(body, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    });
    try {
        value.error ? next((0, http_errors_1.default)(422, value.error.details[0].message)) : next();
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = validator;
//# sourceMappingURL=validator.js.map