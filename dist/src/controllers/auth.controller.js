"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordController = exports.sendForgotPasswordMailController = exports.refreshTokenController = exports.verifyEmailController = exports.loginController = exports.signupController = void 0;
const services_1 = require("@src/services");
const signupController = (req, res, next) => (0, services_1.signupService)(req, res, next);
exports.signupController = signupController;
const loginController = (req, res, next) => (0, services_1.loginService)(req, res, next);
exports.loginController = loginController;
const verifyEmailController = (req, res, next) => (0, services_1.verifyEmailService)(req, res, next);
exports.verifyEmailController = verifyEmailController;
const refreshTokenController = async (req, res, next) => (0, services_1.refreshTokenService)(req, res, next);
exports.refreshTokenController = refreshTokenController;
const sendForgotPasswordMailController = async (req, res, next) => (0, services_1.sendForgotPasswordMailService)(req, res, next);
exports.sendForgotPasswordMailController = sendForgotPasswordMailController;
const resetPasswordController = async (req, res, next) => (0, services_1.resetPasswordService)(req, res, next);
exports.resetPasswordController = resetPasswordController;
exports.default = {
    signupController: exports.signupController,
    loginController: exports.loginController,
    verifyEmailController: exports.verifyEmailController,
    refreshTokenController: exports.refreshTokenController,
    sendForgotPasswordMailController: exports.sendForgotPasswordMailController,
    resetPasswordController: exports.resetPasswordController,
};
//# sourceMappingURL=auth.controller.js.map