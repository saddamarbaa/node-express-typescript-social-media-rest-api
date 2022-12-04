import express from 'express';

import {
  signupController,
  loginController,
  verifyEmailController,
  refreshTokenController,
  sendForgotPasswordMailController,
  resetPasswordController,
  logoutController,
} from '@src/controllers';
import {
  loginUserValidation,
  refreshTokenValidation,
  resetPasswordValidation,
  sendVerificationMailValidation,
  signupUserValidation,
  verifyUserMailValidation,
} from '@src/middlewares';

const router = express.Router();

router.post('/signup', signupUserValidation, signupController);
router.post('/login', loginUserValidation, loginController);
router.post('/logout', refreshTokenValidation, logoutController);
router.get('/verify-email/:userId/:token', verifyUserMailValidation, verifyEmailController);
router.post('/refresh-token', refreshTokenValidation, refreshTokenController);
router.post('/forget-password', sendVerificationMailValidation, sendForgotPasswordMailController);
router.post('/reset-password/:userId/:token', resetPasswordValidation, resetPasswordController);

export = router;
