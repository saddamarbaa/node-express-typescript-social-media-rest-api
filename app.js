/** @format */

// Import express framework from node_modules
const express = require("express");

// Create a new instance of express (initialize express)
const app = express();

// Import the mongoose
const mongoose = require("mongoose");

// Import cors (Using cors)
const cors = require("cors");

// morgan is HTTP Request logger middleware for node.js
const morgan = require("morgan");

// Require dotenv(to manage secrets and configs)
// Using dotenv package to create environment variables
const dotenv = require("dotenv").config();

// Import Routes
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

// Access Environment variables
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

// Connecting to MongoDB(Connecting to the Database)
const mongoDB = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.p8vlm.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;

mongoose
	.connect(mongoDB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() =>
		console.log("MongoDB database connection established successfully ..."),
	)
	.catch((error) => console.log("MongoDB connection error:", error));

// Log the request
app.use(morgan("dev"));

// Determine which domain can access the website
app.use(cors());

// Parses incoming requests with JSON payloads
app.use(express.json());

// Serve all static files inside public directory.
app.use("/static", express.static("public"));

// Routes which Should handle the requests
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Home page API Endpoint (define the home page route)
app.get("/", (req, res) => {
	res.status(200).send({
		Message: "Welcome to My blog Post API",
	});
});

// Error Handling
// Handle error if the routes not found or there's any problem in DB connection
app.use((req, res, next) => {
	// Create an error and pass it to the next function
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

// An error handling middleware
app.use((error, req, res, next) => {
	res.status(error.status || 500).send({
		error: {
			Message: error.message,
		},
	});
});

module.exports = app;
