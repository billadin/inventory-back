const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
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
  img: {
    type: String,
    required: [true, 'Please provide a image URL'],
  },
  role: {
    type: String,
    minlength: 4,
  },
  cart: {
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
   plan:{
    type: String,
    enum: ["bronze", "silver", "gold", "platinum"],
    default: "bronze"
  },
  shopName : {
    type: String,
  },
  shopLimit : {
    type: Number,
    default: 5
  }
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.pre('save', function(next) {
  if (this.plan === 'silver') {
    this.shopLimit = 10;
  } else if (this.plan === 'gold'){
    this.shopLimit = 20; 
  }
   else if (this.plan === 'platinum'){
    this.shopLimit = 30; 
  } else {
    this.shopLimit = 5
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
