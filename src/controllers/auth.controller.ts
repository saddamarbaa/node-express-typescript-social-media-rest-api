import { Request, Response, NextFunction, RequestHandler } from 'express';

import {
  signupService,
  loginService,
  verifyEmailService,
  refreshTokenService,
  sendForgotPasswordMailService,
} from '@src/services';

export const signupController = (req: Request, res: Response, next: NextFunction) => signupService(req, res, next);

export const loginController = (req: Request, res: Response, next: NextFunction) => loginService(req, res, next);

export const verifyEmailController = (req: Request, res: Response, next: NextFunction) =>
  verifyEmailService(req, res, next);

export const refreshTokenController: RequestHandler = async (req, res, next) => refreshTokenService(req, res, next);

export const sendForgotPasswordMailController: RequestHandler = async (req, res, next) =>
  sendForgotPasswordMailService(req, res, next);

export default {
  signupController,
  loginController,
  verifyEmailController,
  refreshTokenController,
  sendForgotPasswordMailController,
};
