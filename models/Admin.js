const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide name'],
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
  role: {
    type: String,
    minlength: 4,
    default: "admin"
  },
  img: {
    type: String,
    required: [true, 'Please provide a image URL'],
  },
  income: {
    type: Number,
    default: 0
  }
});

AdminSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};



module.exports = mongoose.model('Admin', AdminSchema);
