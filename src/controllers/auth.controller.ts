import { Request, Response, NextFunction } from 'express';

import { signupService, loginService, verifyEmailService } from '@src/services';

export const signupController = (req: Request, res: Response, next: NextFunction) => signupService(req, res, next);

export const loginController = (req: Request, res: Response, next: NextFunction) => loginService(req, res, next);

export const verifyEmailController = (req: Request, res: Response, next: NextFunction) =>
  verifyEmailService(req, res, next);

export default { signupController, loginController };
