const express = require('express')
const moment = require('moment')
const Handlebars = require('handlebars')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

// 協助於handlebars判別
Handlebars.registerHelper('if_eq', (selection, value, options) => {
  const stringValue = String(value)
  if (selection === stringValue) {
    return options.fn(this)
  }
  return options.inverse(this)
})

// 新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 新增record
router.post('/', async (req, res) => {
  try {
    const userId = req.user._id
    const { name, date, categoryName, amount } = req.body
    const errors = []
    if (!name || !date || !categoryName || !amount) {
      errors.push({ message: '每個欄位都必須輸入'})
      return res.render('new', { name, date, categoryName, amount, errors })
    }
    const category = await Category.findOne({ name: categoryName }).lean()
    await Record.create({
      name,
      date,
      categoryId: category._id,
      amount,
      userId
    })
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})

// 編輯頁面
router.get('/:record_id/edit', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.record_id
    const record = await Record.findOne({ _id, userId }).lean()
    const category = await Category.findOne({ _id: record.categoryId })
    record.date = moment(record.date).format('YYYY-MM-DD')
    res.render('edit', { record, category: category.name })
  }
  catch (error) {
    console.log(error)
  }
})

// 編輯record
router.put('/:record_id', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.record_id
    const { name, date, categoryName, amount } = req.body
    const errors = []
    if (!name || !date || !categoryName || !amount) {
      errors.push({ message: '每個欄位都必須輸入' })
      return res.render('new', { name, date, categoryName, amount, errors })
    }
    const category = await Category.findOne({ name: categoryName }).lean()
    await Record.updateOne({ _id, userId }, {
      name,
      date,
      categoryId: category._id,
      amount
    })
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})

// 刪除record
router.delete('/:record_id', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.record_id
    await Record.deleteOne({ _id, userId })
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})

// 類別篩選
router.post('/filter', async (req, res) => {
  try {
    const userId = req.user._id
    const categoryId = req.body.filter
    if (!categoryId) return res.redirect('/')
    
    const category = await Category.findOne({ _id: categoryId }).lean()
    const records = await Record.find({ categoryId, userId }).lean().sort({ date: 'asc' })
    let totalAmount = 0
    for (const record of records) {
      record.img = category.image
      record.date = moment(record.date).format('YYYY/MM/DD')
      totalAmount += record.amount
    }
    const categories = await Category.find().lean()
    res.render('index', { records, categories, categoryId, totalAmount })
  }
  catch (error) {
    console.log(error)
  }
})

module.exports = router