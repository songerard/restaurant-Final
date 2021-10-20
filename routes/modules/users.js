const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

// login page
router.get('/login', (req, res) => {
  res.render('login')
})

// login action
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// register page
router.get('/register', (req, res) => {
  res.render('register')
})

// register action
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push('請輸入電郵、密碼及確認密碼')
  }
  if (password !== confirmPassword) {
    errors.push('密碼及確認密碼不一致')
  }
  if (errors.length) {
    return res.render('register', { errors, email, password, confirmPassword })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push('這電郵已經注冊過了')
        return res.render('register', { errors, email, password, confirmPassword })
      }
      User.create({ name, email, password })
        .then(user => {
          res.redirect('/')
        })
    })
})

// logout action
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router