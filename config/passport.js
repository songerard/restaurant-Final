// require passport and local strategy
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// require User model
const User = require('../models/user')

// export module
module.exports = app => {
  // passport initialize and use session
  app.use(passport.initialize())
  app.use(passport.session())

  // Configuration LocalStrategy
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Email not registered.' })
        }
        if (password !== user.password) {
          return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user)
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

