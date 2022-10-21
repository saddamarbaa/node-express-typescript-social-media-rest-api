import express from 'express';

import { signupController, loginController, verifyEmailController, refreshTokenController } from '@src/controllers';
import { refreshTokenValidation } from '@src/middlewares';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/verify-email/:userId/:token', verifyEmailController);
router.post('/refresh-token', refreshTokenValidation, refreshTokenController);

export = router;
