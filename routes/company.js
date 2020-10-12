const express = require('express')
const router = express.Router()

const { create } = require("../controllers/company")

router.post("/company/create", create)

module.exports = router