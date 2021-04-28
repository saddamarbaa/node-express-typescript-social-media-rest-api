/** @format */

const bcrypt = require("bcryptjs");
const User = require("../models/users");
const mongoose = require("mongoose");

const generateAccessToken = require("../auths/getToken");

// API Endpoint for Handling Post Request to / Users/signup
exports.user_signup = (req, res, next) => {
	// Validated that the user was not registered before
	User.find({ email: req.body.email })
		.exec()
		.then((user) => {
			console.log(user);
			if (user.length >= 1) {
				// also we can send  422(422 Unprocessable Entity)
				// 409 Conflict
				return res.status(409).send({
					Status: "unable to save to database user already exits",
				});
			}

			// by now we are sure that the user was not registered before
			bcrypt.hash(req.body.password, 10, function (err, hash) {
				if (err) {
					return res.status(500).send({
						error: error,
					});
				}

				const newUser = new User({
					_id: new mongoose.Types.ObjectId(),
					firstName: req.body.firstName,
					lastName: req.body.firstName,
					email: req.body.email,
					password: hash,
				});

				// Save model to database
				newUser
					.save()
					.then((result) => {
						// HTTP Status 201 indicates that as a result of HTTP POST  request,
						//  one or more new resources have been successfully created on server
						console.log(result);
						res.status(201).send({
							status: "Registered",
						});
					})
					.catch((error) => {
						console.log(error);
						// 500 Internal Server Error
						res.status(500).send({
							Status: "unable to save to user to database",
							error: error,
						});
					});
			});
		});
};

// API Endpoint for Handling Post Request to /User/login
exports.user_login = (req, res, next) => {
	// Validated that the user was not registered before
	// (find) return an array with one user or empty array
	User.find({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length < 1) {
				// 401 Unauthorized
				return res.status(401).send({
					Status: "Auth Failed",
				});
			}

			// Validated password .
			bcrypt.compare(
				req.body.password,
				user[0].password,
				function (err, result) {
					if (err) {
						// 401 Unauthorized
						return res.status(401).send({
							Status: "Auth Failed",
						});
					}

					// if we have user
					if (result) {
						const token = generateAccessToken(user[0]);
						console.log(token);
						return res.status(200).send({
							token: token,
							Status: "Auth successful",
						});
					}
					return res.status(401).send({
						Status: "Auth Failed",
					});
				},
			);
		});
};

// Handling delete Request to delete user
exports.user_delete = (req, res, next) => {
	User.remove({ _id: req.params.userId })
		.exec()
		.then((result) => {
			res.status(200).send({
				Status: "User Deleted",
			});
		})
		.catch((error) => {
			res.status(500).send({
				error: error,
			});
		});
};
