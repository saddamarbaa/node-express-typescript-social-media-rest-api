import { NextFunction } from 'express';

import model from '@src/models/Post.model';
import { TPaginationRequest, TPaginationResponse } from '@src/interfaces';

export const postsPaginationMiddleware = () => {
  return async (req: TPaginationRequest, res: TPaginationResponse, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: any = {
      currentPage: {
        page,
        limit,
      },
      totalDocs: 0,
    };

    const totalCount = await model.countDocuments().exec();
    results.totalDocs = totalCount;

    if (endIndex < totalCount) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }

    results.totalPages = Math.ceil(totalCount / limit);
    results.lastPage = Math.ceil(totalCount / limit);

    // Sort
    const sort: any = {};

    // Sort
    if (req.query.sortBy && req.query.orderBy) {
      sort[req.query.sortBy] = req.query.orderBy.toLowerCase() === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Filter
    let filter: any = {};
    if (req.query.filterBy && req.query.category) {
      console.log(req.query.category.toLowerCase());
      if (req.query.category.toLowerCase() === 'sports') {
        filter.$or = [{ category: 'sports' }];
      } else if (req.query.category.toLowerCase() === 'coding') {
        filter.$or = [{ category: 'coding' }];
      } else if (req.query.category.toLowerCase() === 'typescript') {
        filter.$or = [{ category: 'typescript' }];
      } else if (req.query.category.toLowerCase() === 'nodejs') {
        filter.$or = [{ category: 'nodejs' }];
      } else if (req.query.category.toLowerCase() === 'all') {
        filter = {};
      } else {
        filter = {};
      }
    }

    // Search
    if (req.query.search) {
      filter = {
        $or: [
          { title: { $regex: req.query.search } },
          { content: { $regex: req.query.search } },
          { category: { $regex: req.query.search } },
        ],
      };
    }

    try {
      results.results = await model
        .find(filter)
        .select('title content postImage author createdAt updatedAt, category')
        .populate(
          'author',
          'name firstName lastName  surname email dateOfBirth gender joinedDate isVerified  profileImage  mobileNumber  status role  companyName   acceptTerms nationality  favoriteAnimal  address  bio'
        )
        .limit(limit)
        .sort(sort)
        .skip(startIndex)
        .exec();

      // Add paginated Results to the request

      res.paginatedResults = results;
      next();
    } catch (error) {
      return next(error);
    }
  };
};

export default postsPaginationMiddleware;
