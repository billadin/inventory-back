const { StatusCodes } = require('http-status-codes');
const Store = require('../models/Store');
const User = require('../models/User')


const createStore = async (req, res) => {
    const userId = req.user.userId
    
    req.body.createdBy = userId;


    const user = await User.findOneAndUpdate( { _id: userId }, {
      shopName : req.body.shopName,
      role: "manager"
    } );
    
    const store = await Store.create(req.body);

    console.log(store)
    res.status(StatusCodes.CREATED).json({ store });
  };


  const getShopsAsAdmin = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email
    //Verify email == Admin here, if user not admin throw error

    const shops = await Store.find()
    res.status(StatusCodes.CREATED).json(shops);

  }

  module.exports = {createStore, getShopsAsAdmin}