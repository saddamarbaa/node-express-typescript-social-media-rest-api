"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsPaginationMiddleware = void 0;
const Post_model_1 = __importDefault(require("@src/models/Post.model"));
const postsPaginationMiddleware = () => {
    return async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {
            currentPage: {
                page,
                limit,
            },
            totalDocs: 0,
        };
        const totalCount = await Post_model_1.default.countDocuments().exec();
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
        const sort = {};
        if (req.query.sortBy && req.query.orderBy) {
            sort[req.query.sortBy] = req.query.orderBy.toLowerCase() === 'desc' ? -1 : 1;
        }
        else {
            sort.createdAt = -1;
        }
        let filter = {};
        if (req.query.filterBy && req.query.category) {
            console.log(req.query.category.toLowerCase());
            if (req.query.category.toLowerCase() === 'sports') {
                filter.$or = [{ category: 'sports' }];
            }
            else if (req.query.category.toLowerCase() === 'coding') {
                filter.$or = [{ category: 'coding' }];
            }
            else if (req.query.category.toLowerCase() === 'typescript') {
                filter.$or = [{ category: 'typescript' }];
            }
            else if (req.query.category.toLowerCase() === 'nodejs') {
                filter.$or = [{ category: 'nodejs' }];
            }
            else if (req.query.category.toLowerCase() === 'all') {
                filter = {};
            }
            else {
                filter = {};
            }
        }
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
            results.results = await Post_model_1.default
                .find(filter)
                .select('title content postImage author createdAt updatedAt, category')
                .populate('author', 'name firstName lastName  surname email dateOfBirth gender joinedDate isVerified  profileImage  mobileNumber  status role  companyName   acceptTerms nationality  favoriteAnimal  address  bio')
                .limit(limit)
                .sort(sort)
                .skip(startIndex)
                .exec();
            res.paginatedResults = results;
            next();
        }
        catch (error) {
            return next(error);
        }
    };
};
exports.postsPaginationMiddleware = postsPaginationMiddleware;
exports.default = exports.postsPaginationMiddleware;
//# sourceMappingURL=postsFeatures.middleware.js.map