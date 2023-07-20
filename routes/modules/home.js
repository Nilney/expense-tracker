const express = require('express')
const moment = require('moment')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

// 首頁
router.get('/', async (req, res) => {
  res.render('index')
})

module.exports = router