import express from 'express';

import {
  createPostController,
  getPostsController,
  getPostController,
  deletePostController,
  editPostController,
} from '@src/controllers';
import { isAdmin, isAuth, postsPaginationMiddleware, uploadImage } from '@src/middlewares';

const router = express.Router();

router.get('/', postsPaginationMiddleware(), getPostsController);
router.get('/:postId', getPostController);
router.post('/', isAuth, isAdmin, uploadImage.single('postImage'), createPostController);
router.delete('/:postId', isAuth, isAdmin, deletePostController);
router.patch('/:postId', isAuth, isAdmin, uploadImage.single('postImage'), editPostController);

export = router;
