import express from 'express';

import postRoutes from '@src/routes/post.route';
import authRoutes from '@src/routes/auth.route';
import healthCheckRoute from '@src/routes/index';

const router = express.Router();

router.use('/', healthCheckRoute);
router.use('/posts', postRoutes);
router.use('/auth', authRoutes);

export default router;
