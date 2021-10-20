// require express and Router
const express = require('express')
const router = express.Router()

// require home module
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

// redirect request
router.use('/users', users)
router.use('/restaurants', restaurants)
router.use('/', home)


// export router
module.exports = router