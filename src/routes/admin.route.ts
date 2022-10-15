import express from 'express';

import { deletePostController } from '@src/controllers';

const router = express.Router();

router.delete('/login', deletePostController);

export = router;
