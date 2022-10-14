import express from 'express';

import { signupController, loginController } from '@src/controllers';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);

export = router;
