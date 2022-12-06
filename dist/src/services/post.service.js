"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPostService = exports.deletePostService = exports.getPostService = exports.createPostService = exports.getPostsService = void 0;
const Post_model_1 = __importDefault(require("@src/models/Post.model"));
const utils_1 = require("@src/utils");
const getPostsService = async (_req, res) => {
    if (res?.paginatedResults) {
        const { results, next, previous, currentPage, totalDocs, totalPages, lastPage } = res.paginatedResults;
        const responseObject = {
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
        responseObject.posts = results?.map((doc) => {
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
        return res.status(200).send((0, utils_1.response)({
            success: true,
            error: false,
            message: 'Successful Found posts',
            status: 200,
            data: responseObject,
        }));
    }
};
exports.getPostsService = getPostsService;
const createPostService = async (req, res, next) => {
    const { title, content, category } = req.body;
    if (!req.file) {
        res.status(422).send((0, utils_1.response)({
            data: null,
            success: false,
            error: true,
            message: `Invalid request (Please upload Image)`,
            status: 422,
        }));
    }
    const userId = req?.user?._id || '';
    const postData = new Post_model_1.default({
        title,
        content,
        category,
        postImage: `/static/uploads/posts/${req?.file?.filename}`,
        author: userId,
    });
    try {
        const createdPost = await Post_model_1.default.create(postData);
        return res.status(201).send((0, utils_1.response)({
            data: createdPost,
            success: true,
            error: false,
            message: 'Successfully added new post',
            status: 201,
        }));
    }
    catch (error) {
        return next(error);
    }
};
exports.createPostService = createPostService;
const getPostService = async (req, res, next) => {
    if (!(0, utils_1.isValidMongooseObjectId)(req.params.postId) || !req.params.postId) {
        return res.status(422).send((0, utils_1.response)({
            data: null,
            success: false,
            error: true,
            message: `Invalid request`,
            status: 422,
        }));
    }
    try {
        const doc = await Post_model_1.default.findById(req.params.postId);
        if (!doc) {
            return res.status(400).send((0, utils_1.response)({
                data: [],
                success: false,
                error: true,
                message: `Failed to find post by given ID ${req.params.postId}`,
                status: 400,
            }));
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
        return res.status(200).send((0, utils_1.response)({
            success: true,
            error: false,
            message: `Successfully Found post by given id: ${req.params.postId}`,
            status: 200,
            data,
        }));
    }
    catch (error) {
        console.log('error', error);
        return next(error);
    }
};
exports.getPostService = getPostService;
const deletePostService = async (req, res, next) => {
    if (!(0, utils_1.isValidMongooseObjectId)(req.params.postId) || !req.params.postId) {
        return res.status(422).send((0, utils_1.response)({
            data: null,
            success: false,
            error: true,
            message: `Invalid request`,
            status: 422,
        }));
    }
    try {
        const toBeDeletedPost = await Post_model_1.default.findByIdAndRemove({
            _id: req.params.postId,
        });
        if (!toBeDeletedPost) {
            return res.status(400).send((0, utils_1.response)({
                data: null,
                success: false,
                error: true,
                message: `Failed to delete post by given ID ${req.params.postId}`,
                status: 400,
            }));
        }
        return res.status(200).json((0, utils_1.response)({
            data: null,
            success: true,
            error: false,
            message: `Successfully deleted post by ID ${req.params.postId}`,
            status: 200,
        }));
    }
    catch (error) {
        return next(error);
    }
};
exports.deletePostService = deletePostService;
const editPostService = async (req, res, next) => {
    const { title, content, category } = req.body;
    if (!(0, utils_1.isValidMongooseObjectId)(req.params.postId) || !req.params.postId) {
        return res.status(422).send((0, utils_1.response)({
            data: null,
            success: false,
            error: true,
            message: `Invalid request`,
            status: 422,
        }));
    }
    try {
        const toBeUpdatedPost = await Post_model_1.default.findById(req.params.postId);
        if (!toBeUpdatedPost) {
            return res.status(400).send((0, utils_1.response)({
                data: null,
                success: false,
                error: true,
                message: `Failed to update post by given ID ${req.params.postId}`,
                status: 400,
            }));
        }
        toBeUpdatedPost.title = title || toBeUpdatedPost.title;
        toBeUpdatedPost.content = content || toBeUpdatedPost.content;
        toBeUpdatedPost.postImage = !req.file ? toBeUpdatedPost.postImage : `/static/uploads/posts/${req?.file?.filename}`;
        toBeUpdatedPost.category = category || toBeUpdatedPost?.category;
        const updatedPost = await toBeUpdatedPost.save();
        return res.status(200).json((0, utils_1.response)({
            data: {
                post: updatedPost,
            },
            success: true,
            error: false,
            message: `Successfully updated post by ID ${req.params.postId}`,
            status: 200,
        }));
    }
    catch (error) {
        return next(error);
    }
};
exports.editPostService = editPostService;
exports.default = { getPostsService: exports.getPostsService, getPostService: exports.getPostService, createPostService: exports.createPostService, editPostService: exports.editPostService };
//# sourceMappingURL=post.service.js.map