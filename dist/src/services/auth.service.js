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
exports.resetPasswordService = exports.sendForgotPasswordMailService = exports.refreshTokenService = exports.verifyEmailService = exports.loginService = exports.signupService = void 0;
const http_errors_1 = __importStar(require("http-errors"));
const User_model_1 = __importDefault(require("@src/models/User.model"));
const Token_model_1 = __importDefault(require("@src/models/Token.model"));
const utils_1 = require("@src/utils");
const custom_environment_variables_config_1 = require("@src/configs/custom-environment-variables.config");
const middlewares_1 = require("@src/middlewares");
const signupService = async (req, res, next) => {
    const { email, password, name, confirmPassword, acceptTerms } = req.body;
    const role = custom_environment_variables_config_1.environmentConfig?.ADMIN_EMAIL?.includes(`${email}`) ? 'admin' : 'user';
    const newUser = new User_model_1.default({
        name,
        email,
        password,
        confirmPassword,
        role,
        acceptTerms: acceptTerms || !!custom_environment_variables_config_1.environmentConfig?.ADMIN_EMAIL?.includes(`${email}`),
    });
    try {
        const isEmailExit = await User_model_1.default.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if (isEmailExit) {
            return next((0, http_errors_1.default)(422, `E-Mail address ${email} is already exists, please pick a different one.`));
        }
        const user = await newUser.save();
        let token = await new Token_model_1.default({ userId: user._id });
        const payload = {
            userId: user._id,
        };
        const accessTokenSecretKey = custom_environment_variables_config_1.environmentConfig.ACCESS_TOKEN_SECRET_KEY;
        const accessTokenOptions = {
            expiresIn: custom_environment_variables_config_1.environmentConfig.ACCESS_TOKEN_KEY_EXPIRE_TIME,
            issuer: custom_environment_variables_config_1.environmentConfig.JWT_ISSUER,
            audience: String(user._id),
        };
        const refreshTokenSecretKey = custom_environment_variables_config_1.environmentConfig.REFRESH_TOKEN_SECRET_KEY;
        const refreshTokenJwtOptions = {
            expiresIn: custom_environment_variables_config_1.environmentConfig.REFRESH_TOKEN_KEY_EXPIRE_TIME,
            issuer: custom_environment_variables_config_1.environmentConfig.JWT_ISSUER,
            audience: String(user._id),
        };
        const generatedAccessToken = await token.generateToken(payload, accessTokenSecretKey, accessTokenOptions);
        const generatedRefreshToken = await token.generateToken(payload, refreshTokenSecretKey, refreshTokenJwtOptions);
        token.refreshToken = generatedRefreshToken;
        token.accessToken = generatedAccessToken;
        token = await token.save();
        const verifyEmailLink = `${custom_environment_variables_config_1.environmentConfig.CLIENT_URL}/verify-email.html?id=${user._id}&token=${token.refreshToken}`;
        (0, utils_1.sendEmailVerificationEmail)(email, name, verifyEmailLink);
        const data = {
            user: {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                verifyEmailLink,
            },
        };
        return res.status(201).json((0, utils_1.response)({
            data,
            success: true,
            error: false,
            message: `Auth Signup is success. An Email with Verification link has been sent to your account ${user.email} Please Verify Your Email first or use the email verification lik which is been send with the response body to verfiy your email`,
            status: 201,
        }));
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
};
exports.signupService = signupService;
const loginService = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User_model_1.default.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if (!user) {
            return next((0, http_errors_1.default)(404, 'Auth Failed (Invalid Credentials)'));
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return next((0, http_errors_1.default)(401, 'Auth Failed (Invalid Credentials)'));
        }
        let token = await Token_model_1.default.findOne({ userId: user._id });
        if (!token) {
            token = await new Token_model_1.default({ userId: user._id });
            token = await token.save();
        }
        const generatedAccessToken = await token.generateToken({
            userId: user._id,
        }, custom_environment_variables_config_1.environmentConfig.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: custom_environment_variables_config_1.environmentConfig.ACCESS_TOKEN_KEY_EXPIRE_TIME,
            issuer: custom_environment_variables_config_1.environmentConfig.JWT_ISSUER,
            audience: String(user._id),
        });
        const generatedRefreshToken = await token.generateToken({
            userId: user._id,
        }, custom_environment_variables_config_1.environmentConfig.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: custom_environment_variables_config_1.environmentConfig.REFRESH_TOKEN_KEY_EXPIRE_TIME,
            issuer: custom_environment_variables_config_1.environmentConfig.JWT_ISSUER,
            audience: String(user._id),
        });
        token.refreshToken = generatedRefreshToken;
        token.accessToken = generatedAccessToken;
        token = await token.save();
        if (!user.isVerified || user.status !== 'active') {
            const verifyEmailLink = `${custom_environment_variables_config_1.environmentConfig.CLIENT_URL}/verify-email.html?id=${user._id}&token=${token.refreshToken}`;
            (0, utils_1.sendEmailVerificationEmail)(email, user.name, verifyEmailLink);
            const responseData = {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                verifyEmailLink,
            };
            return res.status(401).json((0, utils_1.response)({
                data: responseData,
                success: false,
                error: true,
                message: `Your Email has not been verified. An Email with Verification link has been sent to your account ${user.email} Please Verify Your Email first or use the email verification lik which is been send with the response to verfiy your email`,
                status: 401,
            }));
        }
        const data = {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user?.role,
                isVerified: user?.isVerified,
                isDeleted: user?.isDeleted,
                status: user?.status,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            },
        };
        res.cookie('accessToken', token.accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
        });
        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
        });
        return res.status(200).json((0, utils_1.response)({
            data,
            success: true,
            error: false,
            message: 'Auth logged in successful.',
            status: 200,
        }));
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
};
exports.loginService = loginService;
const verifyEmailService = async (req, res, next) => {
    try {
        const user = await User_model_1.default.findById(req.params.userId);
        if (!user)
            return next((0, http_errors_1.default)(400, 'Email verification token is invalid or has expired. Please click on resend for verify your Email.'));
        if (user.isVerified && user.status === 'active') {
            return res.status(200).send((0, utils_1.response)({
                data: null,
                success: true,
                error: false,
                message: `User has already been verified. Please Login..`,
                status: 200,
            }));
        }
        const emailVerificationToken = await Token_model_1.default.findOne({
            userId: user._id,
            refreshToken: req.params.token,
        });
        if (!emailVerificationToken) {
            return next((0, http_errors_1.default)(400, 'Email verification token is invalid or has expired.'));
        }
        user.isVerified = true;
        user.status = 'active';
        user.acceptTerms = true;
        await user.save();
        await emailVerificationToken.delete();
        return res.status(200).json((0, utils_1.response)({
            data: null,
            success: true,
            error: false,
            message: 'Your account has been successfully verified . Please Login. ',
            status: 200,
        }));
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
};
exports.verifyEmailService = verifyEmailService;
const refreshTokenService = async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
        let token = await Token_model_1.default.findOne({
            refreshToken,
        });
        if (!token) {
            return next(new http_errors_1.default.BadRequest());
        }
        const userId = await (0, middlewares_1.verifyRefreshToken)(refreshToken);
        if (!userId) {
            return next(new http_errors_1.default.BadRequest());
        }
        const generatedAccessToken = await token.generateToken({
            userId,
        }, custom_environment_variables_config_1.environmentConfig.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: custom_environment_variables_config_1.environmentConfig.ACCESS_TOKEN_KEY_EXPIRE_TIME,
            issuer: custom_environment_variables_config_1.environmentConfig.JWT_ISSUER,
            audience: String(userId),
        });
        const generatedRefreshToken = await token.generateToken({
            userId,
        }, custom_environment_variables_config_1.environmentConfig.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: custom_environment_variables_config_1.environmentConfig.REFRESH_TOKEN_KEY_EXPIRE_TIME,
            issuer: custom_environment_variables_config_1.environmentConfig.JWT_ISSUER,
            audience: String(userId),
        });
        token.refreshToken = generatedRefreshToken;
        token.accessToken = generatedAccessToken;
        token = await token.save();
        const data = {
            user: {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            },
        };
        res.cookie('accessToken', token.accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
        });
        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
        });
        return res.status(200).json((0, utils_1.response)({
            data,
            success: true,
            error: false,
            message: 'Auth logged in successful.',
            status: 200,
        }));
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
};
exports.refreshTokenService = refreshTokenService;
const sendForgotPasswordMailService = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User_model_1.default.findOne({ email });
        if (!user) {
            const message = `The email address ${email} is not associated with any account. Double-check your email address and try again.`;
            return next((0, http_errors_1.default)(401, message));
        }
        let token = await Token_model_1.default.findOne({ userId: user._id });
        if (!token) {
            token = await new Token_model_1.default({ userId: user._id });
            token = await token.save();
        }
        const generatedAccessToken = await token.generateToken({
            userId: user._id,
        }, custom_environment_variables_config_1.environmentConfig.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: custom_environment_variables_config_1.environmentConfig.ACCESS_TOKEN_KEY_EXPIRE_TIME,
            issuer: custom_environment_variables_config_1.environmentConfig.JWT_ISSUER,
            audience: String(user._id),
        });
        const generatedRefreshToken = await token.generateToken({
            userId: user._id,
        }, custom_environment_variables_config_1.environmentConfig.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: custom_environment_variables_config_1.environmentConfig.REST_PASSWORD_LINK_EXPIRE_TIME,
            issuer: custom_environment_variables_config_1.environmentConfig.JWT_ISSUER,
            audience: String(user._id),
        });
        token.refreshToken = generatedRefreshToken;
        token.accessToken = generatedAccessToken;
        token = await token.save();
        const passwordResetEmailLink = `${custom_environment_variables_config_1.environmentConfig.CLIENT_URL}/reset-password.html?id=${user._id}&token=${token.refreshToken}`;
        (0, utils_1.sendResetPasswordEmail)(email, user.name, passwordResetEmailLink);
        const data = {
            user: {
                resetPasswordToken: passwordResetEmailLink,
            },
        };
        return res.status(200).json((0, utils_1.response)({
            data,
            success: true,
            error: false,
            message: `Auth success. An Email with Rest password link has been sent to your account ${email}  please check to rest your password or use the the link which is been send with the response body to rest your password`,
            status: 200,
        }));
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
};
exports.sendForgotPasswordMailService = sendForgotPasswordMailService;
const resetPasswordService = async (req, res, next) => {
    try {
        const user = await User_model_1.default.findById(req.params.userId);
        if (!user)
            return next((0, http_errors_1.default)(401, `Password reset token is invalid or has expired.`));
        const token = await Token_model_1.default.findOne({ userId: req.params.userId, refreshToken: req.params.token });
        if (!token)
            return next((0, http_errors_1.default)(401, 'Password reset token is invalid or has expired.'));
        const userId = await (0, middlewares_1.verifyRefreshToken)(req.params.token);
        if (!userId) {
            return next(new http_errors_1.default.BadRequest());
        }
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        await user.save();
        await token.delete();
        const confirmResetPasswordEmailLink = `${custom_environment_variables_config_1.environmentConfig.CLIENT_URL}/login.html`;
        (0, utils_1.sendConfirmResetPasswordEmail)(user.email, user.name, confirmResetPasswordEmailLink);
        const data = {
            user: {
                loginLink: confirmResetPasswordEmailLink,
            },
        };
        return res.status(200).json((0, utils_1.response)({
            data,
            success: true,
            error: false,
            message: `Your password has been Password Reset Successfully updated please login`,
            status: 200,
        }));
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
};
exports.resetPasswordService = resetPasswordService;
exports.default = {
    signupService: exports.signupService,
    loginService: exports.loginService,
    verifyEmailService: exports.verifyEmailService,
    refreshTokenService: exports.refreshTokenService,
    sendForgotPasswordMailService: exports.sendForgotPasswordMailService,
    resetPasswordService: exports.resetPasswordService,
};
//# sourceMappingURL=auth.service.js.map