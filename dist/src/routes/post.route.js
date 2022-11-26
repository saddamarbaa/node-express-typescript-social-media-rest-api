"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const controllers_1 = require("@src/controllers");
const middlewares_1 = require("@src/middlewares");
const router = express_1.default.Router();
router.get('/', (0, middlewares_1.postsPaginationMiddleware)(), controllers_1.getPostsController);
router.get('/:postId', controllers_1.getPostController);
router.post('/', middlewares_1.isAuth, middlewares_1.isAdmin, middlewares_1.uploadImage.single('postImage'), controllers_1.createPostController);
router.delete('/:postId', middlewares_1.isAuth, middlewares_1.isAdmin, controllers_1.deletePostController);
router.patch('/:postId', middlewares_1.isAuth, middlewares_1.isAdmin, middlewares_1.uploadImage.single('postImage'), controllers_1.editPostController);
module.exports = router;
//# sourceMappingURL=post.route.js.map