import express from 'express';

import { signupController, loginController, verifyEmailController } from '@src/controllers';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/verify-email/:userId/:token', verifyEmailController);

export = router;
