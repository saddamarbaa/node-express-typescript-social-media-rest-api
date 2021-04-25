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

// Log the request
app.use(morgan("dev"));

// Determine which domain can access the website
app.use(cors());

// Parses incoming requests with JSON payloads
app.use(express.json());

// Home page API Endpoint (define the home page route)
app.get("/", (req, res) => {
	res.status(200).send({
		Message: "welcome",
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
