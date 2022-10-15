/** @format */

const mongoose = require("mongoose");
const Posts = require("../models/posts");

// API Endpoint to return all Posts
const getAllPosts = (req, res, next) => {
	// find all the Post
	Posts.find()
		.select("title  content  postImage  _id  addedDate")
		.sort({ addedDate: -1 }) // sorted the post
		.exec() // .exec() method return promise
		.then((posts) => {
			// pass more information  with response
			const responseObject = {
				count: posts.length,
				posts: posts.map((post) => {
					return {
						id: post._id,
						title: post.title,
						content: post.content,
						post_image: post.postImage,
						added_date: post.addedDate,

						request: {
							type: "Get",
							description: "Get one post with the id",
							url: "http://localhost:3000/posts/" + post._id,
						},
					};
				}),
			};

			res.status(200).send({
				result: responseObject,
				status: "Successful Found all Posts",
			});
		})
		.catch((error) => {
			console.log(error);
			// 500 Internal Server Error
			res.status(500).send({
				message: "Internal Server Error",
				error: error,
			});
		});
};

// API Endpoint to return one post based on id (individual Posts Route)
const getIndividualPost = (req, res) => {
	const id = req.params.postId;

	Posts.findById(id)
		.select("title  content  postImage  _id  addedDate")
		.exec()
		.then((post) => {
			if (post) {
				const responseObject = {
					id: post._id,
					title: post.title,
					content: post.content,
					post_image: post.postImage,
					added_date: post.addedDate,

					request: {
						type: "Get",
						description: "Get all posts ",
						url: "http://localhost:3000/api/posts/",
					},
				};

				return res.status(200).send({
					result: responseObject,
					message: "Successful Found Individual Post",
				});
			} else {
				// if the id is not found in db it return null
				return res.status(404).send({
					message: "no valid entry found for provided ID",
				});
			}
		})
		.catch((error) => {
			// 500 Internal Server Error
			return res.status(500).send({
				message: "Internal Server Error(invalid id)",
				error: error,
			});
		});
};

// API Endpoint to add new post
const addNewPost = (req, res) => {
	const image = req.file;
	const postTitle = req.body.title;
	const postContent = req.body.content;

	if (!image) {
		return res.status(400).send("Please upload Image");
	} else if (!postTitle) {
		return res.status(400).send("Please add post title");
	} else if (!postContent) {
		return res.status(400).send("Please add post content");
	}

	const newPost = new Posts({
		_id: new mongoose.Types.ObjectId(),
		title: postTitle,
		content: postContent,
		postImage: `uploads/${req.file.filename}`,
		addedDate: `${Date.now()}`,
	});

	// console.log(newPost);
	newPost
		.save()
		.then((result) => {
			// HTTP Status 201 indicates that as a result of HTTP POST  request,
			//  one or more new resources have been successfully created on server
			return res.status(201).send({
				message: "Created Post Successfully",
				CreatedPost: {
					title: result.title,
					content: result.content,
					postImage: result.postImage,
					_id: result._id,
					addedDate: result.addedDate,
					request: {
						type: "Get",
						description: "Get one post with the id",
						url: "http://localhost:3000/posts/" + result._id,
					},
				},
			});
		})
		.catch((error) => {
			// 500 Internal Server Error
			return res.status(500).send({
				message: "unable to save to database",
				error: error,
			});
		});
};

// API Endpoint to delete individual
const deleteIndividualPost = (req, res) => {
	const id = req.params.postId;

	// also we can use remove
	Posts.remove({ _id: id })
		.exec() // .exec() method return promise
		.then((post) => {
			if (post) {
				return res.status(200).send({
					message: "Successfully deleted the post",
					request: {
						type: "Post",
						description: "You can post new post",
						url: "http://localhost:3000/api/posts",
						data: {
							title: "string",
							content: "string",
							postImage: "string",
						},
					},
				});
			}
		})
		.catch((error) => {
			// 500 Internal Server Error
			res.status(500).send({
				message: "Internal Server Error(invalid id)",
				error: error,
			});
		});
};

// API Endpoint for Handling updating individual post lik comment blow
const updateIndividualPost = (req, res, next) => {
	const id = req.params.postId;
	const updateOperation = {};

	// Excepting user to send an array of object
	// [
	// 	{ operationName: "title", value: "sadamtitle" },
	// 	{ operationName: "content", value: "sadamcontent" },
	// ];
	for (const operation of req.body) {
		updateOperation[operation.operationName] = operation.value;
	}

	// update the post
	Posts.updateOne(
		{ _id: id },
		{
			// $set is mongoose thing we need while updating
			$set: updateOperation,
		},
	)
		.exec() // .exec() method return promise
		.then((docs) => {
			if (docs) {
				res.status(200).send({
					message: "Successfully Updated the post",
					UpdatePost: updateOperation,
					_id: id,
					request: {
						type: "Get",
						description: "Get one post with the id",
						url: "http://localhost:3000/api/posts/" + id,
					},
				});
			}
		})
		.catch((error) => {
			// 500 Internal Server Error
			res.status(500).send({
				message: "Internal Server Error(invalid id)",
				error: error,
			});
		});
};

module.exports = {
	getAllPosts,
	getIndividualPost,
	addNewPost,
	deleteIndividualPost,
	updateIndividualPost,
};
