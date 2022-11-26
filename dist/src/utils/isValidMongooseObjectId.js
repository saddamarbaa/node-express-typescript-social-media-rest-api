"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidMongooseObjectId = void 0;
const mongoose_1 = require("mongoose");
const isValidMongooseObjectId = (id) => {
    if (mongoose_1.Types.ObjectId.isValid(id)) {
        if (String(new mongoose_1.Types.ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
};
exports.isValidMongooseObjectId = isValidMongooseObjectId;
exports.default = exports.isValidMongooseObjectId;
//# sourceMappingURL=isValidMongooseObjectId.js.map