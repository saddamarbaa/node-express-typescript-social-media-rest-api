"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const errorHandlerMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res?.status(statusCode);
    res?.status(statusCode).send({
        data: null,
        success: false,
        error: true,
        message: error.message || 'Internal Server Error',
        status: statusCode,
        stack: process.env.NODE_ENV === 'production' ? '' : error.stack,
    });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
exports.default = exports.errorHandlerMiddleware;
//# sourceMappingURL=errorHandler.js.map