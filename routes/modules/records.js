const express = require('express')
const router = express.Router()

// 新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 編輯頁面
router.get('/edit', (req, res) => {
  res.render('edit')
})

module.exports = router