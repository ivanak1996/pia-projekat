var mongoose = require("mongoose");

let UserSchema = new mongoose.Schema
({
	// 0 - ADMIN
	// 1 - STUDENT
	// 2 - COMPANY
	role: Number,
	username: {type: String, unique: true},
	password: String,
	email: {type: String, unique: true},
	name: {
		first: String,
		last: String
	},
	phoneNumber: String,

	// company fields
	company: {
		name: {type: String, unique: true},
		address: String,
		city: String,
		pib: String,
		numberOfEmployees: Number,
		website: String,
		expertise: String,
		activity: String
	},
	
	// student fields
	student: {
		yearOfStudies: Number,
		hasGraduated: Number,
		university: String
	}

});

module.exports = mongoose.model("User", UserSchema, "users");
