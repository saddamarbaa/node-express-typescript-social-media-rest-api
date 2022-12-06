import { NextFunction, Request, Response } from 'express';

import Post from '@src/models/Post.model';
import { isValidMongooseObjectId, response } from '@src/utils';
import { AuthenticatedRequestBody, Post as TPost, TPaginationResponse } from '@src/interfaces';

export const getPostsService = async (_req: Request, res: TPaginationResponse) => {
  if (res?.paginatedResults) {
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

    responseObject.posts = results?.map((doc: TPost) => {
      return {
        _id: doc?._id,
        title: doc?.title,
        content: doc?.content,
        category: doc?.category,
        postImage: doc?.postImage,
        createdAt: doc?.createdAt,
        updatedAt: doc?.updatedAt,
        author: doc?.author,
      };
    });

    return res.status(200).send(
      response<any>({
        success: true,
        error: false,
        message: 'Successful Found posts',
        status: 200,
        data: responseObject,
      })
    );
  }
};

export const createPostService = async (req: AuthenticatedRequestBody<TPost>, res: Response, next: NextFunction) => {
  const { title, content, category } = req.body;

  if (!req.file) {
    res.status(422).send(
      response<null>({
        data: null,
        success: false,
        error: true,
        message: `Invalid request (Please upload Image)`,
        status: 422,
      })
    );
  }

  const userId = req?.user?._id || '';

  const postData = new Post({
    title,
    content,
    category,
    postImage: `/static/uploads/posts/${req?.file?.filename}`,
    author: userId,
  });

  try {
    const createdPost = await Post.create(postData);

    return res.status(201).send(
      response<TPost>({
        data: createdPost,
        success: true,
        error: false,
        message: 'Successfully added new post',
        status: 201,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const getPostService = async (req: Request, res: Response, next: NextFunction) => {
  if (!isValidMongooseObjectId(req.params.postId) || !req.params.postId) {
    return res.status(422).send(
      response<null>({
        data: null,
        success: false,
        error: true,
        message: `Invalid request`,
        status: 422,
      })
    );
  }

  try {
    const doc = await Post.findById(req.params.postId);
    if (!doc) {
      return res.status(400).send(
        response<[]>({
          data: [],
          success: false,
          error: true,
          message: `Failed to find post by given ID ${req.params.postId}`,
          status: 400,
        })
      );
    }

    const data = {
      post: {
        _id: doc?._id,
        title: doc?.title,
        content: doc?.content,
        postImage: doc?.postImage,
        createdAt: doc?.createdAt,
        updatedAt: doc?.updatedAt,
        author: doc?.author,
        category: doc?.category,
      },
    };

    return res.status(200).send(
      response<{ post: TPost }>({
        success: true,
        error: false,
        message: `Successfully Found post by given id: ${req.params.postId}`,
        status: 200,
        data,
      })
    );
  } catch (error) {
    console.log('error', error);
    return next(error);
  }
};

export const deletePostService = async (req: Request, res: Response, next: NextFunction) => {
  if (!isValidMongooseObjectId(req.params.postId) || !req.params.postId) {
    return res.status(422).send(
      response<null>({
        data: null,
        success: false,
        error: true,
        message: `Invalid request`,
        status: 422,
      })
    );
  }

  try {
    const toBeDeletedPost = await Post.findByIdAndRemove({
      _id: req.params.postId,
    });

    if (!toBeDeletedPost) {
      return res.status(400).send(
        response<null>({
          data: null,
          success: false,
          error: true,
          message: `Failed to delete post by given ID ${req.params.postId}`,
          status: 400,
        })
      );
    }

    return res.status(200).json(
      response<null>({
        data: null,
        success: true,
        error: false,
        message: `Successfully deleted post by ID ${req.params.postId}`,
        status: 200,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const editPostService = async (req: AuthenticatedRequestBody<TPost>, res: Response, next: NextFunction) => {
  const { title, content, category } = req.body;
  if (!isValidMongooseObjectId(req.params.postId) || !req.params.postId) {
    return res.status(422).send(
      response<null>({
        data: null,
        success: false,
        error: true,
        message: `Invalid request`,
        status: 422,
      })
    );
  }

  try {
    const toBeUpdatedPost = await Post.findById(req.params.postId);

    if (!toBeUpdatedPost) {
      return res.status(400).send(
        response<null>({
          data: null,
          success: false,
          error: true,
          message: `Failed to update post by given ID ${req.params.postId}`,
          status: 400,
        })
      );
    }

    toBeUpdatedPost.title = title || toBeUpdatedPost.title;
    toBeUpdatedPost.content = content || toBeUpdatedPost.content;
    toBeUpdatedPost.postImage = !req.file ? toBeUpdatedPost.postImage : `/static/uploads/posts/${req?.file?.filename}`;
    toBeUpdatedPost.category = category || toBeUpdatedPost?.category;

    const updatedPost = await toBeUpdatedPost.save();

    return res.status(200).json(
      response<{ post: TPost }>({
        data: {
          post: updatedPost,
        },
        success: true,
        error: false,
        message: `Successfully updated post by ID ${req.params.postId}`,
        status: 200,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export default { getPostsService, getPostService, createPostService, editPostService };
