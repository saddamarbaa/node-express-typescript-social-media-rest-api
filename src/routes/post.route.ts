import express from 'express';

import { createPostController, getPostsController, getPostController, deletePostController } from '@src/controllers';
import { isAdmin, isAuth, postsPaginationMiddleware, uploadImage } from '@src/middlewares';

const router = express.Router();

router.get('/', isAuth, postsPaginationMiddleware(), getPostsController);
router.get('/:postId', getPostController);
router.post('/', isAuth, isAdmin, uploadImage.single('postImage'), createPostController);
router.delete('/:postId', isAuth, isAdmin, deletePostController);

// TODO
// router.patch("/:postId", authenticateToken, updateIndividualPost);

export = router;
