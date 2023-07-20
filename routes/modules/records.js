const express = require('express')
const moment = require('moment')
const Handlebars = require('handlebars')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

// 新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 編輯頁面
router.get('/edit', (req, res) => {
  res.render('edit')
})

// 類別篩選
// 協助於handlebars判別
Handlebars.registerHelper('if_eq', function (selection, value, options) {
  const stringValue = String(value)
  if (selection === stringValue) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

router.post('/filter', async (req, res) => {
  try {
    const categoryId = req.body.filter
    if (!categoryId) return res.redirect('/')
    
    const category = await Category.findOne({ _id: categoryId }).lean()
    const records = await Record.find({ categoryId }).lean().sort({ date: 'asc' })
    for (const record of records) {
      record.img = category.image
      record.date = moment(record.date).format('YYYY/MM/DD')
    }
    const categories = await Category.find().lean()
    res.render('index', { records, categories, categoryId })
  }
  catch (error) {
    console.log(error)
  }
})

module.exports = router