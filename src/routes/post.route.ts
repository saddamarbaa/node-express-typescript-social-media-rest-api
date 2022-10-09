
import express from 'express';


import { createPostController, getPostsController } from '../controllers';
import { postsPaginationMiddleware } from '../middlewares';
const router = express.Router();


router.get('/', postsPaginationMiddleware(), getPostsController);


router.post('/', createPostController);


export = router;