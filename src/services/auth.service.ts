import { NextFunction, Request, RequestHandler, Response } from 'express';
import createHttpError, { InternalServerError } from 'http-errors';
import { SignOptions } from 'jsonwebtoken';

import User from '@src/models/User.model';
import Token from '@src/models/Token.model';
import { response, sendEmailVerificationEmail, sendResetPasswordEmail } from '@src/utils';
import { ResponseT } from '@src/interfaces';
import { environmentConfig } from '@src/configs/custom-environment-variables.config';
import { verifyRefreshToken } from '@src/middlewares';

export const signupService = async (req: Request, res: Response<ResponseT<null>>, next: NextFunction) => {
  const { email, password, name, confirmPassword, acceptTerms } = req.body;
  const role = environmentConfig?.ADMIN_EMAIL?.includes(`${email}`) ? 'admin' : 'user';
  // const status = environmentConfig?.ADMIN_EMAIL?.includes(`${email}`) ? 'active' : 'pending';

  // const isVerified = !!environmentConfig?.ADMIN_EMAIL?.includes(`${email}`);

  const newUser = new User({
    name,
    email,
    password,
    confirmPassword,
    role,
    // status,
    acceptTerms: acceptTerms || !!environmentConfig?.ADMIN_EMAIL?.includes(`${email}`),
    // isVerified,
  });

  try {
    const isEmailExit = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (isEmailExit) {
      return next(createHttpError(422, `E-Mail address ${email} is already exists, please pick a different one.`));
    }

    const user = await newUser.save();
    let token = await new Token({ userId: user._id });

    const payload = {
      userId: user._id,
    };

    const accessTokenSecretKey = environmentConfig.ACCESS_TOKEN_SECRET_KEY as string;
    const accessTokenOptions: SignOptions = {
      expiresIn: environmentConfig.ACCESS_TOKEN_KEY_EXPIRE_TIME,
      issuer: environmentConfig.JWT_ISSUER,
      audience: String(user._id),
    };

    const refreshTokenSecretKey = environmentConfig.REFRESH_TOKEN_SECRET_KEY as string;
    const refreshTokenJwtOptions: SignOptions = {
      expiresIn: environmentConfig.REFRESH_TOKEN_KEY_EXPIRE_TIME,
      issuer: environmentConfig.JWT_ISSUER,
      audience: String(user._id),
    };

    // Generate and set verify email token
    const generatedAccessToken = await token.generateToken(payload, accessTokenSecretKey, accessTokenOptions);
    const generatedRefreshToken = await token.generateToken(payload, refreshTokenSecretKey, refreshTokenJwtOptions);

    // Save the updated token
    token.refreshToken = generatedRefreshToken;
    token.accessToken = generatedAccessToken;
    token = await token.save();

    const verifyEmailLink = `${environmentConfig.CLIENT_URL}/verify-email.html?id=${user._id}&token=${token.refreshToken}`;

    // send mail for email verification
    sendEmailVerificationEmail(email, name, verifyEmailLink);

    const data = {
      user: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        verifyEmailLink,
      },
    };

    return res.status(201).json(
      response<any>({
        data,
        success: true,
        error: false,
        message: `Auth Signup is success. An Email with Verification link has been sent to your account ${user.email} Please Verify Your Email first or use the email verification lik which is been send with the response body to verfiy your email`,
        status: 201,
      })
    );
  } catch (error) {
    return next(InternalServerError);
  }
};

export const loginService = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    // 401 Unauthorized
    if (!user) {
      return next(createHttpError(404, 'Auth Failed (Invalid Credentials)'));
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return next(createHttpError(401, 'Auth Failed (Invalid Credentials)'));
    }

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = await new Token({ userId: user._id });
      token = await token.save();
    }

    const generatedAccessToken = await token.generateToken(
      {
        userId: user._id,
      },
      environmentConfig.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: environmentConfig.ACCESS_TOKEN_KEY_EXPIRE_TIME,
        issuer: environmentConfig.JWT_ISSUER,
        audience: String(user._id),
      }
    );
    const generatedRefreshToken = await token.generateToken(
      {
        userId: user._id,
      },
      environmentConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: environmentConfig.REFRESH_TOKEN_KEY_EXPIRE_TIME,
        issuer: environmentConfig.JWT_ISSUER,
        audience: String(user._id),
      }
    );

    // Save the updated token
    token.refreshToken = generatedRefreshToken;
    token.accessToken = generatedAccessToken;
    token = await token.save();

    // check user is verified or not
    if (!user.isVerified || user.status !== 'active') {
      const verifyEmailLink = `${environmentConfig.CLIENT_URL}/verify-email.html?id=${user._id}&token=${token.refreshToken}`;

      // Again send verification email
      sendEmailVerificationEmail(email, user.name, verifyEmailLink);

      const responseData = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        verifyEmailLink,
      };

      return res.status(401).json(
        response<typeof responseData>({
          data: responseData,
          success: false,
          error: true,
          message: `Your Email has not been verified. An Email with Verification link has been sent to your account ${user.email} Please Verify Your Email first or use the email verification lik which is been send with the response to verfiy your email`,
          status: 401,
        })
      );
    }

    // Response data
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

    // Set cookies
    res.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // one days
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
    });

    // Set refreshToken' AND accessToken IN cookies
    return res.status(200).json(
      response<typeof data>({
        data,
        success: true,
        error: false,
        message: 'Auth logged in successful.',
        status: 200,
      })
    );
  } catch (error) {
    return next(InternalServerError);
  }
};

export const verifyEmailService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return next(
        createHttpError(
          400,
          'Email verification token is invalid or has expired. Please click on resend for verify your Email.'
        )
      );

    // user is already verified
    if (user.isVerified && user.status === 'active') {
      return res.status(200).send(
        response<null>({
          data: null,
          success: true,
          error: false,
          message: `User has already been verified. Please Login..`,
          status: 200,
        })
      );
    }

    const emailVerificationToken = await Token.findOne({
      userId: user._id,
      refreshToken: req.params.token,
    });

    if (!emailVerificationToken) {
      return next(createHttpError(400, 'Email verification token is invalid or has expired.'));
    }
    // Verfiy the user
    user.isVerified = true;
    user.status = 'active';
    user.acceptTerms = true;
    await user.save();
    await emailVerificationToken.delete();

    return res.status(200).json(
      response<null>({
        data: null,
        success: true,
        error: false,
        message: 'Your account has been successfully verified . Please Login. ',
        status: 200,
      })
    );
  } catch (error) {
    return next(InternalServerError);
  }
};

export const refreshTokenService: RequestHandler = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    let token = await Token.findOne({
      refreshToken,
    });

    if (!token) {
      return next(new createHttpError.BadRequest());
    }

    const userId = await verifyRefreshToken(refreshToken);

    if (!userId) {
      return next(new createHttpError.BadRequest());
    }

    const generatedAccessToken = await token.generateToken(
      {
        userId,
      },
      environmentConfig.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: environmentConfig.ACCESS_TOKEN_KEY_EXPIRE_TIME,
        issuer: environmentConfig.JWT_ISSUER,
        audience: String(userId),
      }
    );
    const generatedRefreshToken = await token.generateToken(
      {
        userId,
      },
      environmentConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: environmentConfig.REFRESH_TOKEN_KEY_EXPIRE_TIME,
        issuer: environmentConfig.JWT_ISSUER,
        audience: String(userId),
      }
    );

    // Save the updated token
    token.refreshToken = generatedRefreshToken;
    token.accessToken = generatedAccessToken;
    token = await token.save();

    // Response data
    const data = {
      user: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      },
    };

    // Set cookies
    res.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // one days
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
    });

    // Set refreshToken' AND accessToken IN cookies
    return res.status(200).json(
      response<typeof data>({
        data,
        success: true,
        error: false,
        message: 'Auth logged in successful.',
        status: 200,
      })
    );
  } catch (error) {
    return next(InternalServerError);
  }
};

export const sendForgotPasswordMailService: RequestHandler = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const message = `The email address ${email} is not associated with any account. Double-check your email address and try again.`;
      return next(createHttpError(401, message));
    }

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = await new Token({ userId: user._id });
      token = await token.save();
    }

    const generatedAccessToken = await token.generateToken(
      {
        userId: user._id,
      },
      environmentConfig.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: environmentConfig.ACCESS_TOKEN_KEY_EXPIRE_TIME,
        issuer: environmentConfig.JWT_ISSUER,
        audience: String(user._id),
      }
    );
    const generatedRefreshToken = await token.generateToken(
      {
        userId: user._id,
      },
      environmentConfig.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: environmentConfig.REFRESH_TOKEN_KEY_EXPIRE_TIME,
        issuer: environmentConfig.JWT_ISSUER,
        audience: String(user._id),
      }
    );

    // Save the updated token
    token.refreshToken = generatedRefreshToken;
    token.accessToken = generatedAccessToken;
    token = await token.save();

    const passwordResetEmailLink = `${environmentConfig.CLIENT_URL}/reset-password.html?id=${user._id}&token=${token.refreshToken}`;

    // password Reset Email
    sendResetPasswordEmail(email, user.name, passwordResetEmailLink);

    const data = {
      user: {
        resetPasswordToken: passwordResetEmailLink,
      },
    };

    return res.status(200).json(
      response<typeof data>({
        data,
        success: true,
        error: false,
        message: `Auth success. An Email with Rest password link has been sent to your account ${email}  please check to rest your password or use the the link which is been send with the response body to rest your password`,
        status: 200,
      })
    );
  } catch (error) {
    return next(InternalServerError);
  }
};
export default { signupService, loginService, verifyEmailService, refreshTokenService, sendForgotPasswordMailService };
