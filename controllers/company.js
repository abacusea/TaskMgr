const Company = require("../models/company")
const { errorHandler } = require("../helpers/dbErrorHandler")

exports.create = (req, res) => {
	const company = new Company(req.body)
	company.save((err, data) => {
		if(err) {
			return res.status(400).json({
				error: errorHandler(err)
			})
		}
		res.json({ data })
	})
}