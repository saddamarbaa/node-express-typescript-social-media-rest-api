/** @format */

const fs = require("fs");
const { posix } = require("path");
const PATH = "./data.json";

class Post {
	constructor() {}

	get() {
		// get Posts
		return this.readData();
	}

	getIndividualBlog(postId) {
		// Get one Blog Post bae on Id
		const posts = this.readData();
		const foundPost = posts.find((post) => post.id === postId);
		return foundPost;
	}

	addNewPost(newPost) {
		// add new given post
		const currentPosts = this.readData();
		currentPosts.unshift(newPost);
		// console.log(currentPosts);
		this.storeData(currentPosts);
	}

	readData() {
		// read JSON data
		const rawdata = fs.readFileSync(PATH);
		const posts = JSON.parse(rawdata);
		return posts;
	}

	storeData(rawData) {
		// (store) write data to JSON file
		let data = JSON.stringify(rawData);
		fs.writeFileSync(PATH, data);
	}
}

module.exports = Post;
