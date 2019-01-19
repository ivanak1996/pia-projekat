var mongoose = require("mongoose");
/*
{
    "Title": "Generalni pokrovitelj",
    "Content": [ "Stand 4x velicine", "Logo i 2 strane u boji u brosuri", "Logo na promo majicama trostruke velicine"],
    "VideoPromotion": 15,
    "NoLessons": 2,
    "NoWorkchops": 1,
    "NoPresentation": 0,
    "Price": 30000,
    "MaxCompanies": 1
    }
*/
let PackageSchema = new mongoose.Schema
({
	Title: String,
	Content: [String],
	VideoPromotion: Number,
	NoLessons: Number,
	NoWorkchops: Number,
	NoPresentation: Number,
    Price: Number,
    MaxCompanies: Number
});

module.exports = mongoose.model("Package", PackageSchema, "packages");
