// require express
const express = require('express')
const app = express()

// require mongodb config
require('./config/mongoose')

// load restaurant model
const Restaurant = require('./models/restaurant')

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

// set port
const port = 3000

// use static files
app.use(express.static('public'))

// set listen to localhost:3000
app.listen(port, () => {
  console.log(`Express is listening to http://localhost:${port}`)
})

// Use router
const routes = require('./routes')
app.use(routes)

