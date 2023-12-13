const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  products: {
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
          type: Number,
          required: [true, "Please enter product quantity"],
          min: [0, "Quantity cannot be negative"]
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
        unit: {
          type: String,
          required: [true, "Please enter product unit"],
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
        saleCount: {
          type: Number,
          default: 0,
        },
        createdDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: []
  },
});

module.exports = mongoose.model("Product", ProductSchema);
