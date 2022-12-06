"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("@src/middlewares");
const controllers_1 = require("@src/controllers");
const router = express_1.default.Router();
router.post('/signup', middlewares_1.signupUserValidation, controllers_1.signupController);
router.post('/login', middlewares_1.loginUserValidation, controllers_1.loginController);
router.post('/logout', middlewares_1.refreshTokenValidation, controllers_1.logoutController);
router.patch('/update/:userId', middlewares_1.updateUserValidation, middlewares_1.isAuth, controllers_1.updateAuthController);
router.delete('/remove/:userId', middlewares_1.isAuth, controllers_1.removeAuthController);
router.get('/verify-email/:userId/:token', middlewares_1.verifyUserMailValidation, controllers_1.verifyEmailController);
router.post('/refresh-token', middlewares_1.refreshTokenValidation, controllers_1.refreshTokenController);
router.post('/forget-password', middlewares_1.sendVerificationMailValidation, controllers_1.sendForgotPasswordMailController);
router.post('/reset-password/:userId/:token', middlewares_1.resetPasswordValidation, controllers_1.resetPasswordController);
router.get('/me', middlewares_1.isAuth, controllers_1.getAuthProfileController);
module.exports = router;
//# sourceMappingURL=auth.route.js.map