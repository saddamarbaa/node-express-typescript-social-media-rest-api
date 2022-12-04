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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.PostSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide title'],
    },
    content: {
        type: String,
        trim: true,
        required: [true, 'Please provide post description'],
    },
    postImage: { type: String, required: true },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'author is required'],
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['coding', 'sports', 'nodejs', 'all', 'typescript'],
        default: 'all',
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.default.models.Post || mongoose_1.default.model('Post', exports.PostSchema);
//# sourceMappingURL=Post.model.js.map