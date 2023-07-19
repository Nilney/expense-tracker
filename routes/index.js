const express = require('express')
const router = express.Router()

// 首頁
router.get('/', (req, res) => {
  res.render('index')
})

// 新增頁面
router.get('/records/new', (req, res) => {
  res.render('new')
})

// 編輯頁面
router.get('/records/edit', (req, res) => {
  res.render('edit')
})

module.exports = router