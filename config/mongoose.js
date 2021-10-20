// require mongodb and connect db 'restaurant-list'
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list')
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// export mongodb connection
module.exports = db