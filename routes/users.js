/** @format */

const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");

// Import Middleware function to authenticate token From different file
const authenticateToken = require("../auths/auth");

// API Endpoint for Handling Post Request to /User/login
router.post("/login", userController.user_login);

// API Endpoint for Handling Post Request to /Users/signup
router.post("/signup", userController.user_signup);

// API Endpoint for Handling Post Request to /Users/delete
// Call (authenticateToken) Middleware function first
// This is now a protected route
router.delete("/:userId", authenticateToken, userController.user_delete);

module.exports = router;
