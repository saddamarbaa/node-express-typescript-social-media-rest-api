"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPostController = exports.deletePostController = exports.createPostController = exports.getPostController = exports.getPostsController = void 0;
const services_1 = require("@src/services");
const getPostsController = (req, res) => (0, services_1.getPostsService)(req, res);
exports.getPostsController = getPostsController;
const getPostController = (req, res, next) => (0, services_1.getPostService)(req, res, next);
exports.getPostController = getPostController;
const createPostController = (req, res, next) => (0, services_1.createPostService)(req, res, next);
exports.createPostController = createPostController;
const deletePostController = (req, res, next) => (0, services_1.deletePostService)(req, res, next);
exports.deletePostController = deletePostController;
const editPostController = (req, res, next) => (0, services_1.editPostService)(req, res, next);
exports.editPostController = editPostController;
exports.default = {
    getPostsController: exports.getPostsController,
    createPostController: exports.createPostController,
    getPostController: exports.getPostController,
    deletePostController: exports.deletePostController,
    editPostController: exports.editPostController,
};
//# sourceMappingURL=post.controller.js.map