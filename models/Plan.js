const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
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
    enum: ["bronze", "silver", "gold", "platinum"],
    default: "bronze",
    required: [true, 'Please select a plan']
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Plan", PlanSchema);
