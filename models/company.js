const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        shortName: {
        	type: String,
            trim: true,
            required: true,
            maxlength: 4,
            unique: true
        },
        code: {
        	type: String,
            trim: true,
            required: true,
            maxlength: 10,
            unique: true
        },
        status: {
        	type: Boolean
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
