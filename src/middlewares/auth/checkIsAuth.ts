import jwt, { VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';

import { response } from '@src/utils';
import { environmentConfig } from '@src/configs/custom-environment-variables.config';
import { IAuthRequest, IUser } from '@src/interfaces';

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

  jwt.verify(
    token,
    environmentConfig.ACCESS_TOKEN_SECRET_KEY as jwt.Secret,
    (err: VerifyErrors | null, decodedUser: any) => {
      if (err) {
        // JsonWebTokenError or token has expired
        const errorMessage = err.name === 'JsonWebTokenError' ? 'Auth Failed (Unauthorized)' : err.message;
        return res.status(403).send(
          response<null>({
            data: null,
            success: false,
            error: true,
            message: errorMessage,
            status: 403,
          })
        );
      }

      // console.log('The Authorized User is ', decodedUser);
      // Add user to the request
      req.user = decodedUser as IUser;

      // if we did success go to the next middleware
      next();
    }
  );
};

export default { isAuth };
