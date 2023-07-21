const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login',
  (req, res, next )=> {
    const {email, password } = req.body
    if (!email || !password) {
      req.flash('login_err', '請輸入 Email 與 Password')
      return res.redirect('/users/login')
    }
    next()
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
)

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '全部欄位都是必填！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符' })
  }
  // 若有任何錯誤請使用者重填，不進行資料庫操作
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password, confirmPassword
    })
  }

  // 無錯誤就進行註冊程序
  User.findOne({ email }).then(user => {
    // 檢查email是否已註冊
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', { errors, name, email, password, confirmPassword })
    }
    // 註冊
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
    .catch(err => console.log(err))
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router