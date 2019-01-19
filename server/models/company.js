var mongoose = require("mongoose");

let CompanySchema = new mongoose.Schema
({
	// 0 - ADMIN
	// 1 - STUDENT
	// 2 - COMPANY
	role: Number,
	email: String,
	name: {
		first: String,
		last: String
	},
	phoneNumber: String,

	// company fields
	company: {
		name: String,
		address: String,
		city: String,
		pib: String,
		numberOfEmployees: Number,
		website: String,
		expertise: String,
		activity: String
	}

});

module.exports = mongoose.model("Company", CompanySchema, "users");
