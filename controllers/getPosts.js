/** @format */

// Requiring models
const post = require("../api/models/posts");

// Create object from Post Class
const postData = new post();

// Home page API Endpoint (define the home page route)
const getHomePage = (req, res) => {
	res.status(200).send(
		"Hello, my friends Nice to Meet You welcome to My blog Post API",
	);
};

// API Endpoint to return all Posts (define the Posts route)
const getAllPosts = (req, res) => {
	return res.status(200).send(postData.get());
};

// API Endpoint to return one post based on id (individual Posts Route)
const getIndividualPost = (req, res) => {
	const postId = req.params.postId;
	const foundPost = postData.getIndividualBlog(postId);
	if (foundPost) {
		res.status(200).send({ foundPost });
	} else {
		res.status(404).send("Not Found");
	}
};

module.exports = { getHomePage, getAllPosts, getIndividualPost };
