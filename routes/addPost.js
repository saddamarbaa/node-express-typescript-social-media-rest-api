/** @format */

// Import express  from node_modules
const express = require("express");

// Grab The Router from express
const router = express.Router();

// Requiring models
const post = require("../api/models/posts");

// Create object from Post Class
const postData = new post();

// Import multer from node_modules
const multer = require("multer");

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

// Check Image Extension
const getImageExtension = (mimetype) => {
	switch (mimetype) {
		case "image/png":
			return ".png";
		case "image/PNG":
			return ".PNG";
		case "image/jpg":
			return ".jpg";
		case "image/JPG":
			return ".JPG";
		case "image/JPEG":
			return ".JPEG";
		case "image/jpeg":
			return ".jpeg";
		case "image/webp":
			return ".webp";
	}
};

// Initialize upload variable
const upload = multer({ storage: storage });

// API Endpoint to add new Post (Add Route)
// Upload Single file(image)
router.post("/", upload.single("post_image"), (req, res) => {
	console.log(12);
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

	const newPost = {
		id: `${Date.now()}`,
		title: postTitle,
		content: postContent,
		post_image: `uploads/${req.file.filename}`,
		added_date: `${Date.now()}`,
	};

	postData.addNewPost(newPost);
	return res.status(201).send(newPost);
});

module.exports = router;
