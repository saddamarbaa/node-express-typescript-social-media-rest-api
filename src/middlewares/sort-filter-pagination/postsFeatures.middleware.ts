// @ts-nocheck

import model from '../../models/Post.model';

export const postsPaginationMiddleware = () => {
  return async (req, res, next) => {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {
      currentPage: {
        page: page,
        limit: limit,
      },
    };

    const totalCount = await model.countDocuments().exec();

    results.totalDocs = totalCount;
    if (endIndex < totalCount) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.totalPages = Math.ceil(totalCount / limit);
    results.lastPage = Math.ceil(totalCount / limit);

    // Sort
    const sort = {};
    if (req.query.sortBy && req.query.OrderBy) {
      sort[req.query.sortBy] = req.query.OrderBy.toLowerCase() === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Filter feature is TODO
    // Filter
    let filter = {};
    if (req.query.filterBy && req.query.category) {
      console.log(req.query.category.toLowerCase());
      if (req.query.category.toLowerCase() === 'coding') {
        filter.$or = [{ category: 'Coding' }];
      } else if (req.query.category.toLowerCase() === 'nodejs') {
        filter.$or = [{ category: 'Node js' }];
      } else {
        filter = {};
      }
    }

    // Search
    if (req.query.search) {
      filter = {
        $or: [{ title: { $regex: req.query.title } }, { content: { $regex: req.query.content } }],
      };
    }
    // console.log('filter', filter);

    try {
      results.results = await model
        .find(filter)
        .select('title content postImage author createdAt updatedAt')
        // .populate(
        //   'userId',
        //   'firstName lastName  surname email dateOfBirth gender joinedDate cart isVerified  profileImage  mobileNumber  status role  companyName   acceptTerms nationality  favoriteAnimal  address  profileImage  bio mobileNumber',
        // )
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
