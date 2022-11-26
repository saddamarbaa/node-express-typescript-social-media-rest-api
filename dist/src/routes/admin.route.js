"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const controllers_1 = require("@src/controllers");
const router = express_1.default.Router();
router.delete('/login', controllers_1.deletePostController);
module.exports = router;
//# sourceMappingURL=admin.route.js.map