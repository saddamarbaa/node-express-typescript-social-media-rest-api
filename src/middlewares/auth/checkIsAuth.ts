import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';

import { response } from '@src/utils';
import { environmentConfig } from '@src/configs/custom-environment-variables.config';
import { IAuthRequest } from '@src/interfaces';

export const isAuth = (req: IAuthRequest, res: Response, next: NextFunction) => {
  const authHeader = (req && req.headers.authorization) || (req && req.headers.Authorization);
  const token = (authHeader && authHeader.split(' ')[1]) || req?.cookies?.authToken || '';

  if (!token) {
    return res.status(401).send(
      response<null>({
        data: null,
        success: false,
        error: true,
        message: 'Auth Failed (Invalid Credentials)',
        status: 401,
      })
    );
  }

  jwt.verify(token, environmentConfig.TOKEN_SECRET as jwt.Secret, (err: any, user: any) => {
    if (err) {
      return res.status(403).send(
        response<null>({
          data: null,
          success: false,
          error: true,
          message: 'Auth Failed (Unauthorized)!',
          status: 403,
        })
      );
    }

    console.log('The Authorized User is ', user);
    // Add user to the request
    req.user = user;

    // if we did success go to the next middleware
    next();
  });
};

export default { isAuth };
