import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import ErrorResponse from '../../interfaces/ErrorResponse';

// @ts-ignore
export const errorHandlerMiddleware: ErrorRequestHandler = (error, req, res: Response<ErrorResponse>,  next: NextFunction ) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res?.status(statusCode);
  res?.status( statusCode).send({
    data: null,
    success: false,
    error: true,
    message: error.message || 'Internal Server Error',
    status: statusCode,
    stack:  process.env.NODE_ENV === 'production' ? '' : error.stack,
  });
};

export default errorHandlerMiddleware;