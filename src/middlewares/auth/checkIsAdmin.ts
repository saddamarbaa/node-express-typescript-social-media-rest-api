import { NextFunction, Response } from 'express';

import User from '@src/models/User.model';
import { response } from '@src/utils';
import { environmentConfig } from '@src/configs/custom-environment-variables.config';
import { IAuthRequest as IAdminRequest, IUser } from '@src/interfaces';

export const isAdmin = async (req: IAdminRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ _id: req?.user?.userId });

    const adminUser =
      user && user.role === environmentConfig.ADMIN_ROLE && environmentConfig?.ADMIN_EMAIL?.includes(`${user?.email}`);

    if (!adminUser) {
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

    // console.log('The Authorized Admin is ', user);
    req.user = user as IUser;
    next();
  } catch (error) {
    return next(error);
  }
};

export default { isAdmin };
