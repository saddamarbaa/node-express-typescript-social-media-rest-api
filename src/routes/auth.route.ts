import express from 'express';

import {
  isAuth,
  loginUserValidation,
  refreshTokenValidation,
  resetPasswordValidation,
  sendVerificationMailValidation,
  signupUserValidation,
  updateUserValidation,
  verifyUserMailValidation,
} from '@src/middlewares';
import {
  loginController,
  logoutController,
  updateAuthController,
  refreshTokenController,
  removeAuthController,
  resetPasswordController,
  sendForgotPasswordMailController,
  signupController,
  verifyEmailController,
  getAuthProfileController,
} from '@src/controllers';

const router = express.Router();

router.post('/signup', signupUserValidation, signupController);
router.post('/login', loginUserValidation, loginController);
router.post('/logout', refreshTokenValidation, logoutController);
router.patch('/update/:userId', updateUserValidation, isAuth, updateAuthController);
router.delete('/remove/:userId', isAuth, removeAuthController);
router.get('/verify-email/:userId/:token', verifyUserMailValidation, verifyEmailController);
router.post('/refresh-token', refreshTokenValidation, refreshTokenController);
router.post('/forget-password', sendVerificationMailValidation, sendForgotPasswordMailController);
router.post('/reset-password/:userId/:token', resetPasswordValidation, resetPasswordController);
router.get('/me', isAuth, getAuthProfileController);

export = router;
