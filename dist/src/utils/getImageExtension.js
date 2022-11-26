"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageExtension = void 0;
const getImageExtension = (mimetype) => {
    switch (mimetype) {
        case 'image/png':
            return '.png';
        case 'image/PNG':
            return '.PNG';
        case 'image/jpg':
            return '.jpg';
        case 'image/JPG':
            return '.JPG';
        case 'image/JPEG':
            return '.JPEG';
        case 'image/jpeg':
            return '.jpeg';
        case 'image/webp':
            return '.webp';
        default:
            return false;
    }
};
exports.getImageExtension = getImageExtension;
exports.default = exports.getImageExtension;
//# sourceMappingURL=getImageExtension.js.map