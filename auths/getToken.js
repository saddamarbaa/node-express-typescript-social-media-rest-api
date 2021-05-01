/** @format */

// Import jwt from node_modules (Using jwt)
const jwt = require("jsonwebtoken");

// function for Generating Token
const generateAccessToken = (user) => {
	console.log(user);
	const payload = {
		id: user.password,
		email: user.email,
	};

	// expires 1 hours
	return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1hr" });
};

module.exports = generateAccessToken;
