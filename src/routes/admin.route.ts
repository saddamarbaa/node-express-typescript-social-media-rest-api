import express from 'express';

import { isAdmin, isAuth } from '@src/middlewares';
import { getUsersController } from '@src/controllers';

const router = express.Router();

router.get('/users', isAuth, isAdmin, getUsersController);

export = router;
