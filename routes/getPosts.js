/** @format */

// Import express framework from node_modules
const express = require("express");

// Grab The Router from express
const router = express.Router();

// Grab The flowing Object from controllers
const {
	getHomePage,
	getAllPosts,
	getIndividualPost,
} = require("../controllers/getPosts");

// Home page API Endpoint (define the home page route)
router.get("/", getHomePage);

// API Endpoint to return all Posts (define the Posts route)
router.get("/posts", getAllPosts);

// API Endpoint to return one post based on id (individual Posts Route)
router.get("/posts/:postId", getIndividualPost);

module.exports = router;
