import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { IUser } from './User';

export interface Post {
  title: string;
  content: string;
  postImage: string;
  author: mongoose.Schema.Types.ObjectId;
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
}

export interface AuthenticatedRequestBody<T> extends Request {
  body: T;
  user?: IUser;
}

export interface TPage {
  page: number;
  limit: number;
}

export interface TPaginationRequest extends Request {
  query: {
    limit: string;
    page: string;
    orderBy: string;
    sortBy: string;
    filterBy: string;
    category: string;
    search: string;
    content: string;
    title: string;
  };
}

export interface TPaginationResponse extends Response {
  paginatedResults?: {
    results: any;
    next: string;
    previous: string;
    currentPage: string;
    totalDocs: string;
    totalPages: string;
    lastPage: string;
  };
}
