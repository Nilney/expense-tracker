const express = require('express')
const moment = require('moment')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

// 首頁
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    const records = await Record.find({ userId }).lean().sort({ date: 'asc'})
    for (const record of records) {
      const category = await Category.findOne({ _id: record.categoryId }).lean()
      record.img = category.image
      record.date = moment(record.date).format('YYYY/MM/DD')
    }
    const categories = await Category.find().lean()
    res.render('index', { records, categories })
  } catch (error) {
    console.log(error)
  } 
})

module.exports = router