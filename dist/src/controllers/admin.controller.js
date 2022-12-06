"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersController = void 0;
const services_1 = require("@src/services");
const getUsersController = (req, res, next) => (0, services_1.getUsersService)(req, res, next);
exports.getUsersController = getUsersController;
exports.default = {
    getUsersController: exports.getUsersController,
};
//# sourceMappingURL=admin.controller.js.map