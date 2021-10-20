// require express and Router
const express = require('express')
const router = express.Router()

// require authenticator
const { authenticator } = require('../middleware/auth')

// require home module
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

// redirect request
// check authentication for home and restaurants route
// before go to next step
router.use('/users', users)
router.use('/restaurants', authenticator, restaurants)
router.use('/', authenticator, home)

// export router
module.exports = router