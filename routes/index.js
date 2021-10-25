// require express and Router
const express = require('express')
const router = express.Router()

// require authenticator
const { authenticator } = require('../middleware/auth')

// require modules
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')

// redirect request
// check authentication for home and restaurants route
// before go to next step
router.use('/users', users)
router.use('/restaurants', authenticator, restaurants)
router.use('/auth', auth)
router.use('/', authenticator, home)

// export router
module.exports = router