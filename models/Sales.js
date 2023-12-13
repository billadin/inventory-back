const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID"],
  },
  soldProducts: {
    type: [
      {
        name: {
          type: String,
          required: [true, "Please provide product name"],
          maxlength: 50,
          minlength: 3,
        },
        image: {
          type: String,
          required: [true, "Please enter a image URL"],
        },
        quantity: {
          type: String,
          required: [true, "Please enter product quantity"],
        },
        location: {
          type: String,
          required: [true, "Please provide store location"],
        },
        cost: {
          type: String,
          required: [true, "Please enter production cost"],
        },
        profit: {
          type: String,
          required: [true, "Please enter profit amount"],
        },
        discount: {
          type: String,
          required: [true, "Please enter discount amount"],
        },
        description: {
          type: String,
          required: [true, "Please provide product description"],
          minlength: 4,
        },
        sku: {
          type: String,
          required: [true, "Please provide product SKU"],
        },
        sellingPrice: {
          type: String,
          required: [true, "Please enter selling price"],
        },
        category: {
          type: String,
          required: [true, "Please enter category"],
        },
        shopId: {
          type: mongoose.Types.ObjectId,
          ref: "Store",
          required: [true, "Please provide shop ID"],
        },
        shopName: {
          type: String,
          required: [true, "Please provide shop name"],
        },
        soldDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // default: []
  },
  salesCount: {
    type: Number,
  },
  totalInvest: {
    type: Number,
  },
  totalProfit: {
    type: Number,
  }
});

module.exports = mongoose.model("Sales", SalesSchema);
