var mongoose = require("mongoose");

let JobOpeningSchema = new mongoose.Schema
({
	title: String,
    description: String,
    openUntil: Date,
    appliedStudents: [String],
    jobType: String, //internship or job
    companyName: String
});

module.exports = mongoose.model("JobOffer", JobOpeningSchema, "jobOffers");
