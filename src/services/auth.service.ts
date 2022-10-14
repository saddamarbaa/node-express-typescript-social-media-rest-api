import { NextFunction, Request, Response } from 'express';

import User from '@src/models/User.model';
import Token from '@src/models/Token.model';
import { response } from '@src/utils';
import { ResponseT } from '@src/interfaces';
import { environmentConfig } from '@src/configs/environment.config';

export const signupService = async (req: Request, res: Response<ResponseT<null>>, next: NextFunction) => {
  const { email, password, name, confirmPassword } = req.body;
  const role = environmentConfig?.ADMIN_EMAIL?.includes(`${email}`) ? 'admin' : 'user';

  const newUser = new User({
    name,
    email,
    password,
    confirmPassword,
    role,
  });

  try {
    const isEmailExit = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (isEmailExit) {
      return res.status(422).json(
        response<null>({
          data: null,
          success: false,
          error: true,
          message: `E-Mail address ${email} is already exists, please pick a different one.`,
          status: 422,
        })
      );
    }

    const user = await newUser.save();
    const token = await new Token({ userId: user._id });

    // Generate and set verify email token
    token.generateEmailVerificationToken();

    // Save the updated token object
    await token.save();

    // Todo ( send mail for email verification)
    // Send back refreshToken and accessToken
    // const token = user.createJWT();
    // const accessToken = await signAccessToken(user._id);
    // const refreshToken = await signRefreshToken(user._id);

    return res.status(201).json(
      response<null>({
        data: null,
        success: true,
        error: false,
        message: 'Success',
        status: 201,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const loginService = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    const authFailedResponse = response<null>({
      data: null,
      success: false,
      error: true,
      message: 'Auth Failed (Invalid Credentials)',
      status: 401,
    });

    // 401 Unauthorized
    if (!user) {
      return res.status(authFailedResponse.status).json(response<null>(authFailedResponse));
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(authFailedResponse.status).json(response<null>(authFailedResponse));
    }

    // check user is verified or not
    if (!user.isVerified || user.status !== 'active') {
      // Again send verification email
      //  todo
    }

    // TOdo
    // send mail for email verification

    // Send back only the user, refreshToken and accessToken (dont send the password)
    const token = user.createJWT();

    // Response data
    const data = {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user?.role,
        isVerified: user?.isVerified,
        token,
        isDeleted: user?.isDeleted,
        status: user?.status,
      },
    };

    // send jwt token as kookie
    res.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // one year
      secure: process.env.NODE_ENV === 'production',
    });

    // TODO
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
    return next(error);
  }
};

export default { signupService, loginService };
