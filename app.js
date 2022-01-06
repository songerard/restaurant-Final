// require express
const express = require('express')
const app = express()

// require dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// require express-session
const session = require('express-session')
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// require mongodb config
require('./config/mongoose')

// load restaurant model
const Restaurant = require('./models/restaurant')

// require passport
const usePassport = require('./config/passport')
usePassport(app)

// require connect-flash
const flash = require('connect-flash')
app.use(flash())

// send req data to res.locals
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.user = req.user
  res.locals.successMsg = req.flash('successMsg')
  res.locals.warningMsg = req.flash('warningMsg')
  res.locals.email = req.flash('email')
  res.locals.password = req.flash('password')
  next()
})

// require method-override
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// set express-handlebars as view engine
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// require body-parser
const bodyParser = require('body-parser')
app.use(express.urlencoded({ extended: true }))

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// set port
const port = process.env.PORT

// use static files
app.use(express.static('public'))

// set listen to localhost:3000
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`)
})

// Use router
const routes = require('./routes')
app.use(routes)

