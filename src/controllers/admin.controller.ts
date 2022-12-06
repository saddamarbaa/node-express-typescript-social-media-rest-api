import { Request, Response, NextFunction } from 'express';

import { getUsersService } from '@src/services';

export const getUsersController = (req: Request, res: Response, next: NextFunction) => getUsersService(req, res, next);

export default {
  getUsersController,
};
