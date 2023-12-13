const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide user name'],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user ID'],
  },
  description: {
    type: String,
    required: [true, 'Please provide store description'],
    minlength: 4,
  },
  location: {
    type: String,
    required: [true, 'Please provide store location'],
  },
  logo: {
    type: String,
    required: [true, 'Please provide store logo'],
  },
  shopName: {
    type: String,
    required: [true, 'Please provide shop name'],
    minlength: 4
  },
  shopLimit : {
    type: Number,
    default: 5
  }
});


module.exports = mongoose.model('Store', StoreSchema);
