// require express, handlebars and Router
const express = require('express')
const router = express.Router()

// require Restaurant model
const Restaurant = require('../../models/restaurant')

// set express-handlebars as view engine
const exphbs = require('express-handlebars')

// register new handlebars function
let selectedRestaurantCategory = ''
let hbs = exphbs.create({})
hbs.handlebars.registerHelper('if_eq', function (a, options) {
  if (a === selectedRestaurantCategory) {
    return options.fn(this)
  }
})

// set route

// new restaurant page
router.get('/new', (req, res) => {
  let allCategory = []
  Restaurant.find()
    .lean()
    .then(restaurants => {
      restaurants.forEach(r => {
        // if category not found in allCategory, then add in allCategory
        if (allCategory.indexOf(r.category) === -1) {
          allCategory.push(r.category)
        }
      })
      allCategory.sort
      res.render('new', { allCategory })
    })
    .catch(error => console.error(error))
})

// add new restaurant into mongodb
router.post('/', (req, res) => {
  const userId = req.user._id

  let {
    name,
    name_en,
    category,
    other_category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  } = req.body

  category = (category === '其他') ? other_category : category

  Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
    userId
  })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

// show restaurant details page
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

// edit restaurant page
router.get('/:id/edit', (req, res) => {
  let allCategory = []
  Restaurant.find()
    .lean()
    .then(restaurants => {
      restaurants.forEach(r => {
        // if category not found in allCategory, then add in allCategory
        if (allCategory.indexOf(r.category) === -1) {
          allCategory.push(r.category)
        }
      })
      allCategory.sort
    })
    .catch(error => console.error(error))

  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => {
      // render edit page and set restaurant's current category as default
      selectedRestaurantCategory = restaurant.category
      res.render('edit', { restaurant, allCategory })
    })
    .catch(error => console.error(error))
})

// edit restaurant
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      Object.assign(restaurant, req.body)
      // update category if "Other category" exist
      restaurant.category = (req.body.other_category) ? req.body.other_category : restaurant.category
      restaurant.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

// delete restaurant
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router