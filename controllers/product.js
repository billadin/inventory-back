const mongoose = require('mongoose')
const { StatusCodes } = require('http-status-codes');
const Store = require('../models/Store');
const User = require('../models/User')
const Product = require('../models/Product');
const AllProducts = require('../models/AllProducts');
const { BadRequestError } = require('../errors');



const createProduct = async (req, res) => {

    //Finding the user
    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const shopLimit = user?.shopLimit
    const email  = user?.email
    const shop = await Store.findOne( { createdBy: userId } );
    const {shopName, _id} = shop
    req.body.shopName = shopName;
    req.body.shopId = _id;
    const productUser = await Product.findOne( { email } );

    if(productUser===null) {
        const product = await Product.create({email, products : req.body});
        const allProduct = await AllProducts.create(req.body);
        return res.status(StatusCodes.CREATED).json({ product });
    } 
    const {products} = productUser;
    if(products.length >= shopLimit) {
        throw new BadRequestError('You have reached the max product limit. Please purchase a plan')
    }
    else {
        const product = await Product.updateOne({ email },
            { $push: { products: req.body } });
        const allProduct = await AllProducts.create(req.body);
        res.status(StatusCodes.OK).json({ product });
    }
  };


  const getProducts = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email
    const userObject = await Product.findOne( { email } );
    const products = userObject?.products;
    if (products) {
        return res.status(StatusCodes.OK).json( products );
    } else {
        res.status(StatusCodes.OK).json( {msg: 'No product found'} );
    }
  }



  const updateProduct = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email
    const sku = req?.body?.sku
    const { _id, ...updateObject} = req?.body 

    const result = await Product.updateOne(
        { email, 'products.sku': sku },
        {
          $set: {
            'products.$': updateObject,
          },
        },
        { new: true, runValidators: true }
      );
    const allProductUpdate = await AllProducts.updateOne(
       { sku },  updateObject, { upsert: true }
      );
      console.log(allProductUpdate)
    if(result?.acknowledged=== true || result?.modifiedCount ===1) {
      res.status(StatusCodes.OK).json({ result });
    }
}


const deleteProduct = async (req, res) => {

    const sku = req?.body?.sku;
    console.log('sku', sku)
    const productId =  req.params?.id
    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email
    const result = await Product.updateOne(
        { email, 'products._id': productId },
        {
            $pull: {
                products: { _id : productId },
              }
        },
        { new: true, runValidators: true }
      );
      if(result?.acknowledged=== true || result?.modifiedCount ===1) {
        const allProduct = await AllProducts.deleteOne({sku});
        res.status(StatusCodes.OK).json({ result });
      }
}

const searchProduct = async (req, res) => {
  const id = req?.query?.id;
  const userId = req.user.userId;
  const user = await User.findOne({ _id: userId });
  const email = user?.email;
  const productObject = await Product.findOne(
    { email , 
      products : { $elemMatch: { _id: id } }
    },
    { 'products.$': 1 }
  )
  const searchedProductArray = productObject?.products
  if(searchedProductArray) {
    res.status(StatusCodes.OK).json(searchedProductArray);
  }else {
    res.status(StatusCodes.OK).json({ msg : 'No Products found' });
  }
}


const addToCheckout = async (req, res) => {
    //Finding the user
    const productObject = req?.body
    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email
    if(user) {
        const product = await User.updateOne({ email },
        { $push: { cart: productObject } });
        res.status(StatusCodes.OK).json({ product });
    }
  }

  const getCheckoutList = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );

    if(user) {
        const cartItems = user?.cart
        return res.status(StatusCodes.OK).json(cartItems);
    }
    res.status(StatusCodes.OK).json({ msg: 'No product found' });
  }


  const getAllProducts = async (req, res) => {
    const allProducts = await AllProducts.find()
    if(allProducts) {
      return res.status(StatusCodes.OK).json(allProducts);
    } else {
      return res.status(StatusCodes.OK).json({allProducts: []});
    }

  }
  module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    searchProduct,
    addToCheckout,
    getCheckoutList,
    getAllProducts
  };