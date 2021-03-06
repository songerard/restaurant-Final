// require express and Router
const express = require('express')
const router = express.Router()

// require Restaurant model
const Restaurant = require('../../models/restaurant')

// set route

// home page
router.get('/', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword ? req.query.keyword.trim() : ''
  const sort = [req.query.sort1, req.query.sort2, req.query.sort3]

  RestaurantFind(keyword, sort, userId).then(rows => {

    // if no restaurant found, then show alert and list all restaurants
    if (!rows.length) {
      RestaurantFind('', sort, userId).then(all => {
        const searchAlert = true
        const showReturnBtn = false
        const restaurants = all
        res.render('index', { restaurants, keyword, searchAlert, showReturnBtn })
        // return
      })
    } else {
      // if any restaurant found
      const searchAlert = false
      const restaurants = rows
      const showReturnBtn = keyword ? true : false
      res.render('index', { restaurants, keyword, searchAlert, showReturnBtn })
    }
  }).catch(e => {
    console.error(e)
  })
})

function RestaurantFind(keyword, sortOption, userId) {

  let where = keyword ? {
    $and: [
      { userId },
      {
        $or: [
          { 'name': { "$regex": keyword, "$options": "i" } },
          { 'category': { "$regex": keyword, "$options": "i" } }
        ]
      }
    ]
  } : { userId }

  // default sorting is { 'rating': 'desc', 'name': 'asc' }
  let sort = sortOption[0] ? sortOption : ['rd', 'na']

  // code for sorting options
  const sortingCode = {
    r: 'rating', n: 'name', c: 'category',
    d: 'desc', a: 'asc'
  }

  // selected sorting options
  const selectedSortingOptions = {}
  sort.forEach(q => {
    if (q) {
      selectedSortingOptions[sortingCode[q[0]]] = sortingCode[q[1]]
    }
  })

  return Restaurant.find(where).lean().sort(selectedSortingOptions)
}



//   const userId = req.user._id
//   Restaurant.find({ userId })
//     .lean()
//     .sort({ 'rating': 'desc', 'name': 'asc' })
//     .then(restaurants => res.render('index', { restaurants }))
//     .catch(error => console.error(error))
// })

// // search restaurant
// router.get('/search', (req, res) => {
//   const keyword = req.query.keyword.trim()
//   const userId = req.user._id

//   // get all restaurants from mongodb by userId
//   const allRestaurants = []
//   Restaurant.find({ userId })
//     .lean()
//     .sort({ 'rating': 'desc', 'name': 'asc' })
//     .then(restaurants => {
//       allRestaurants.push(...restaurants)
//     })

//   // filter restaurants by userId and keyword in name or category
//   Restaurant.find({
//     $and: [
//       { userId },
//       {
//         $or: [
//           { 'name': { "$regex": keyword, "$options": "i" } },
//           { 'category': { "$regex": keyword, "$options": "i" } }
//         ]
//       }
//     ]
//   })
//     .lean()
//     .sort({ 'rating': 'desc', 'name': 'asc' })
//     .then(filteredRestaurants => {

//       // if no restaurant found, then set alert = true and show all restaurants
//       const searchAlert = (!filteredRestaurants.length || !keyword) ? true : false
//       const restaurants = (filteredRestaurants.length) ? filteredRestaurants : allRestaurants
//       const showReturnBtn = (!searchAlert) ? true : false

//       // render index page
//       res.render('index', { restaurants, keyword, searchAlert, showReturnBtn })
//     })
//     .catch(error => console.error(error))
// })

// // sort restaurant
// router.get('/sort', (req, res) => {
//   // get sorting query
//   const sortingQuery = [
//     req.query.sort1,
//     req.query.sort2,
//     req.query.sort3
//   ]

//   // code for sorting options
//   const sortingCode = {
//     r: 'rating',
//     n: 'name',
//     c: 'category',
//     d: 'desc',
//     a: 'asc'
//   }

//   // selected sorting options
//   const selectedSortingOptions = {}
//   sortingQuery.forEach(q => {
//     if (q) {
//       selectedSortingOptions[sortingCode[q[0]]] = sortingCode[q[1]]
//     }
//   })

//   // sort Restaurant according to selected sorting options by userId
//   const userId = req.user._id
//   Restaurant.find({ userId })
//     .lean()
//     .sort(selectedSortingOptions)
//     .then(restaurants => res.render('index', { restaurants }))
//     .catch(error => console.error(error))
// })

// export module
module.exports = router