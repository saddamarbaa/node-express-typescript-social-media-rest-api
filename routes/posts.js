/** @format */

const express = require("express");
const router = express.Router();
const multer = require("multer");

const authenticateToken = require("../auths/auth");
getImageExtension = require("../helpers/getImageExtension");

// Grab The flowing Object from controllers
const {
	getAllPosts,
	getIndividualPost,
	addNewPost,
	deleteIndividualPost,
	updateIndividualPost,
} = require("../controllers/posts");

// Set Storage Engine
// Configuring and validating the upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads");
	},

	// By default, multer removes file extensions so let's add them back
	filename: (req, file, cb) => {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${getImageExtension(file.mimetype)}`,
		);
	},
});

// Initialize upload variable
const upload = multer({ storage: storage });

// API Endpoint for Handling Post Request to /posts
router.get("/", getAllPosts);

// API Endpoint for Handling Post Request to /posts
router.post("/", authenticateToken, upload.single("postImage"), addNewPost);

// API Endpoint to return one post based on id (individual Posts Route)
router.get("/:postId", getIndividualPost);

// API Endpoint to delete individual
router.delete("/:postId", authenticateToken, deleteIndividualPost);

// API Endpoint for Handling updating individual product
router.patch("/:postId", authenticateToken, updateIndividualPost);

module.exports = router;
