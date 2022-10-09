import express from 'express';

import posts from '../routes/post.route';
import healthCheckRoute from '../routes/index';

const router = express.Router();

/** Healthcheck */
router.use('/', healthCheckRoute);
router.use('/posts', posts);

export default router;

