const mongoose = require('mongoose')

const mongoURL ='mongodb://localhost:27017/first'

mongoose.connect(mongoURL,{
  
})

const db = mongoose.connection

db.on('connected', () => {
  console.log('Connected to MongoDb')
})

db.on('error', () => {
  console.log('MongoDb connection error')
})

db.on('disconnected', () => {
  console.log('MongoDb disconnection')
})

module.exports = db;
