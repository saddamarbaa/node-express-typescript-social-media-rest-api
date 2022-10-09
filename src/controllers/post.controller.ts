import { Request, Response, NextFunction } from 'express';

import { createPostService, getPostsService } from '../services';

export const getPostsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiResponse = await getPostsService(req, res, next);
    return res.status(200).json(apiResponse);
  } catch (error) {
    return next(error);
  }
};

export const createPostController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiResponse = await createPostService(req, res, next);
    return res.status(200).json(apiResponse);
  } catch (error) {
    return next(error);
  }
};

export default { getPostsController, createPostController };
