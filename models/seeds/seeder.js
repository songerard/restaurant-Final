// require mongodb connection
const db = require('../../config/mongoose')

// require bcryptjs
const bcrypt = require('bcryptjs')

// require Restaurant and User model
const Restaurant = require('../restaurant')
const User = require('../user')

// get restaurant seeder json
const restaurantSeeder = require('../../restaurant.json').results

// set user seeder
const userSeeds = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantIdList: [1, 2, 3]
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantIdList: [4, 5, 6]
  }
]

// once mongodb connected
db.once('open', () => {
  console.log('create seeds!')
  userSeeds.forEach(seed => {
    // get restaurantIdList for matching restaurant id later
    const restaurantIdList = seed.restaurantIdList

    // use bcryptjs to encrypt password
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seed.password, salt))
      .then(hash => {
        seed.password = hash
        // create user list in mongodb
        User.create(seed)
          .then(user => {
            const userId = user._id
            restaurantIdList.forEach(restaurantId => {
              // find a restaurant matches restaurant id of current user
              const restaurant = restaurantSeeder.find(element => element.id === restaurantId)
              restaurant.userId = userId
              // create a restaurant in mongodb
              Restaurant.create(restaurant)
            })
          })
          .catch(error => console.error(error))
      })

  })
})