const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  body: { type: Object },
  senderId: { type: String }
})

module.exports = mongoose.model('User', User)