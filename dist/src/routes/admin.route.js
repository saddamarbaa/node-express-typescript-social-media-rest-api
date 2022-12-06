"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("@src/middlewares");
const controllers_1 = require("@src/controllers");
const router = express_1.default.Router();
router.get('/users', middlewares_1.isAuth, middlewares_1.isAdmin, controllers_1.getUsersController);
module.exports = router;
//# sourceMappingURL=admin.route.js.map