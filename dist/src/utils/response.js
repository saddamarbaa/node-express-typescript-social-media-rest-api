"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
const response = ({ data, success, error, message, status }) => {
    return {
        success,
        error,
        message,
        status,
        data,
    };
};
exports.response = response;
exports.default = exports.response;
//# sourceMappingURL=response.js.map