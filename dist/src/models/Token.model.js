"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.TokenSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordExpires: {
        type: Date,
        required: false,
    },
    emailVerificationToken: {
        type: String,
        required: false,
    },
    emailVerificationExpiresToken: {
        type: Date,
        required: false,
    },
    accessToken: {
        type: String,
        required: false,
    },
    refreshToken: {
        type: String,
        required: false,
    },
}, { timestamps: true });
exports.TokenSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto_1.default.randomBytes(32).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000;
};
exports.TokenSchema.methods.generateEmailVerificationToken = function () {
    this.emailVerificationToken = crypto_1.default.randomBytes(32).toString('hex');
    this.emailVerificationExpiresToken = Date.now() + 3600000;
};
exports.TokenSchema.methods.generateToken = function (payload, secret, signOptions) {
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.sign(payload, secret, signOptions, (err, encoded) => {
            if (err === null && encoded !== undefined) {
                resolve(encoded);
            }
            else {
                reject(err);
            }
        });
    });
};
exports.TokenSchema.post('save', function () {
    console.log('Token is been Save ', this);
});
exports.default = mongoose_1.default.models.Token || mongoose_1.default.model('Token', exports.TokenSchema);
//# sourceMappingURL=Token.model.js.map