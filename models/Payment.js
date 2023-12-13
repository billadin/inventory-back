const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  username: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID"],
  },
  plan:{
    type: String,
    required: [true, 'Please provide a plan']
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  transactionId : {
    type : String,
    required: [true, 'Please add the transaction ID']
  },
  price: {
    type: Number,
    required: [true, 'Please add price']
  }
});

module.exports = mongoose.model("Payment", PaymentSchema);
