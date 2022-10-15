import express, { Request, Response } from 'express';

import { response } from '../utils';
import { ResponseT } from '../interfaces';

const router = express.Router();

// GET home page.
router.get('/healthChecker', (req: Request, res: Response<ResponseT<null>>) => {
  const message = 'Welcome to blog API';
  res.send(response<null>({ data: null, success: false, error: true, message, status: 200 }));
});

export = router;
