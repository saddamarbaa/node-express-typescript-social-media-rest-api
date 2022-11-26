"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const controllers_1 = require("@src/controllers");
const middlewares_1 = require("@src/middlewares");
const router = express_1.default.Router();
router.post('/signup', middlewares_1.signupUserValidation, controllers_1.signupController);
router.post('/login', middlewares_1.loginUserValidation, controllers_1.loginController);
router.get('/verify-email/:userId/:token', middlewares_1.verifyUserMailValidation, controllers_1.verifyEmailController);
router.post('/refresh-token', middlewares_1.refreshTokenValidation, controllers_1.refreshTokenController);
router.post('/forget-password', middlewares_1.sendVerificationMailValidation, controllers_1.sendForgotPasswordMailController);
router.post('/reset-password/:userId/:token', middlewares_1.resetPasswordValidation, controllers_1.resetPasswordController);
module.exports = router;
//# sourceMappingURL=auth.route.js.map