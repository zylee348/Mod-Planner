const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  studentNumber: {
    type: String,
    required: true
  },
  modules: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;