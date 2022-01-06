// require dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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
const SEED_USER = [
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
  Promise.all(SEED_USER.map(seed => {
    // get restaurantIdList for matching restaurant id later
    const restaurantIdList = seed.restaurantIdList

    // use bcryptjs to encrypt password
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seed.password, salt))
      .then(hash => {
        seed.password = hash
        // create user list in mongodb
        return User.create(seed)
          .then(user => {
            const userId = user._id
            const restaurantList = []
            restaurantIdList.forEach(restaurantId => {
              // find a restaurant matches restaurant id of current user
              const restaurant = restaurantSeeder.find(element => element.id === restaurantId)
              restaurant.userId = userId
              restaurantList.push(restaurant)
            })
            // create a restaurant in mongodb
            return Restaurant.create(restaurantList)
          })
      })
  }))
    .then(() => {
      console.log('seed created!')
      process.exit()
    })
    .catch(error => console.error(error))
})