"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.key2 = exports.key1 = void 0;
const crypto_1 = __importDefault(require("crypto"));
exports.key1 = crypto_1.default.randomBytes(32).toString('hex');
exports.key2 = crypto_1.default.randomBytes(32).toString('hex');
console.table({ key1: exports.key1, key2: exports.key2 });
exports.default = { key1: exports.key1, key2: exports.key2 };
//# sourceMappingURL=generateSecretKey.js.map