// require passport and local strategy
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// require bcryptjs
const bcrypt = require('bcryptjs')

// require User model
const User = require('../models/user')

// export module
module.exports = app => {
  // passport initialize and use session
  app.use(passport.initialize())
  app.use(passport.session())

  // Configuration LocalStrategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('warningMsg', '這電郵仍未註冊過')
          return done(null, false)
        }
        return bcrypt
          .compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              req.flash('warningMsg', '密碼錯誤')
              return done(null, false)
            }
            return done(null, user)
          })
      })
      .catch(err => done(err))
  }))

  // serialize and deserialize user instances to and from the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err))
  })
}

