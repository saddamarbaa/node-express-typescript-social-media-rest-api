"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get('/healthChecker', (req, res) => {
    const message = 'Welcome to blog API';
    res.send((0, utils_1.response)({ data: null, success: false, error: true, message, status: 200 }));
});
module.exports = router;
//# sourceMappingURL=index.js.map