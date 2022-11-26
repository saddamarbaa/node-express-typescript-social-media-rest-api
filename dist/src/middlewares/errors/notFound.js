"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
function notFoundMiddleware(req, res, next) {
    res.status(404);
    const error = new Error(`Route - ${req.originalUrl}  Not Found`);
    next(error);
}
exports.notFoundMiddleware = notFoundMiddleware;
exports.default = notFoundMiddleware;
//# sourceMappingURL=notFound.js.map