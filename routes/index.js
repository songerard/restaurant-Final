// require express and Router
const express = require('express')
const router = express.Router()

// require home module
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
// const search = require('./modules/search')

// redirect request
router.use('/', home)
router.use('/restaurants', restaurants)


// export router
module.exports = router