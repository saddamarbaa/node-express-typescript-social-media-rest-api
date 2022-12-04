import express from 'express';

import {
  isAdmin,
  isAuth,
  loginUserValidation,
  refreshTokenValidation,
  resetPasswordValidation,
  sendVerificationMailValidation,
  signupUserValidation,
  verifyUserMailValidation,
} from '@src/middlewares';
import {
  loginController,
  logoutController,
  refreshTokenController,
  removeAuthController,
  resetPasswordController,
  sendForgotPasswordMailController,
  signupController,
  verifyEmailController,
} from '@src/controllers';

const router = express.Router();

router.post('/signup', signupUserValidation, signupController);
router.post('/login', loginUserValidation, loginController);
router.post('/logout', refreshTokenValidation, logoutController);
router.delete('/remove/:userId', isAuth, isAdmin, removeAuthController);
router.get('/verify-email/:userId/:token', verifyUserMailValidation, verifyEmailController);
router.post('/refresh-token', refreshTokenValidation, refreshTokenController);
router.post('/forget-password', sendVerificationMailValidation, sendForgotPasswordMailController);
router.post('/reset-password/:userId/:token', resetPasswordValidation, resetPasswordController);

export = router;
