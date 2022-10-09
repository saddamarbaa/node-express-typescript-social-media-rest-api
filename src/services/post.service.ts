import { NextFunction, Request, Response } from 'express';

import Post from '../models/Post.model';
import { response } from '../utils';

export const getPostsService = async (req: Request, res: Response, _next: NextFunction) => {
  // @ts-ignore
  const { results, next, previous, currentPage, totalDocs, totalPages, lastPage } = res.paginatedResults;

  const responseObject: any = {
    totalDocs: totalDocs || 0,
    totalPages: totalPages || 0,
    lastPage: lastPage || 0,
    count: results?.length || 0,
    currentPage: currentPage || 0,
  };

  if (next) {
    responseObject.nextPage = next;
  }
  if (previous) {
    responseObject.prevPage = previous;
  }

  responseObject.posts = results.map((doc: any) => {
    return {
      _id: doc?._id,
      title: doc?.title,
      content: doc?.content,
      postImage: doc?.postImage,
      createdAt: doc?.createdAt,
      updatedAt: doc?.updatedAt,
      author: doc?.author,
    };
  });

  return response<any>({
    data: responseObject,
    success: true,
    error: false,
    message: 'Successful Found posts',
    status: 200,
  });
};

export const createPostService = async (req: Request, res: Response, next: NextFunction) => {
  const { title, content, postImage, addedDate, author } = req.body;

  const postData = new Post({
    author,
    title,
    content,
    addedDate,
    postImage,
  });

  try {
    const createdPost = await Post.create(postData);
    return response<any>({
      data: createdPost,
      success: true,
      error: false,
      message: 'Successfully added new post',
      status: 201,
    });
  } catch (error) {
    console.log('error');
    return next(error);
  }
};

export default { getPostsService, createPostService };
