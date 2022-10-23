import express from 'express';

import { signupController, loginController, verifyEmailController, refreshTokenController } from '@src/controllers';
import {
  loginUserValidation,
  refreshTokenValidation,
  signupUserValidation,
  verifyUserMailValidation,
} from '@src/middlewares';

const router = express.Router();

router.post('/signup', signupUserValidation, signupController);
router.post('/login', loginUserValidation, loginController);
router.get('/verify-email/:userId/:token', verifyUserMailValidation, verifyEmailController);
router.post('/refresh-token', refreshTokenValidation, refreshTokenController);

export = router;
