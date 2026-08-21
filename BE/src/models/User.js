const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
  },
  {
    collection: 'users', // MongoDB collection name
  }
);

console.log('MONGOSH CONNECTION: ', mongoose.model('User', userSchema));

module.exports = mongoose.model('User', userSchema);