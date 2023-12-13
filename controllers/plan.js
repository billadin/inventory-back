const mongoose = require('mongoose')
require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
const Store = require('../models/Store');
const User = require('../models/User')
const stripe = require("stripe")(process.env.STRIPE_SECRET);


const { BadRequestError } = require('../errors');
const Plan = require('../models/Plan');
const Payment = require('../models/Payment');
const Admin = require('../models/Admin');

const buyPlan = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email
    const username = user?.username
    const selectedPlan = req.body?.plan
    console.log(selectedPlan)
    let shopLimit;
    if(selectedPlan === 'silver') {
        shopLimit = 200
    }
    else if(selectedPlan === 'gold') {
        shopLimit = 450
    }
    else if(selectedPlan === 'platinum') {
        shopLimit = 1500
    }else {
        shopLimit = 3
    }
    const currentDate = new Date();
    const planObject = {
        email, username, userId, plan: selectedPlan, 
    }
    
    
    const checkUserPlan = await Plan.findOne({email})

    if(checkUserPlan) {
        const changePlanResult = await Plan.findOneAndUpdate(
        {
            email,
            username
        },
        { $set : {
            plan : selectedPlan,
            purchaseDate: currentDate,
            shopLimit
        }},
        { new: true, runValidators: true }
        )
        const changeUserPlanResult = await User.findOneAndUpdate(
        {
            email,
            username
        },
        { $set : {
            plan : selectedPlan,
            purchaseDate: currentDate,
            shopLimit
        }},
        { new: true, runValidators: true }
        )
        const changeShopPlanResult = await Store.findOneAndUpdate(
        {
            email,
            username
        },
        { $set : {
            plan : selectedPlan,
            purchaseDate: currentDate,
            shopLimit
        }},
        { new: true, runValidators: true }
        )
        res.status(StatusCodes.OK).json( {changePlanResult, changeUserPlanResult, changeShopPlanResult} );
    }else {
      const newPlanResult = await Plan.create(planObject);
      const changeUserPlanResult = await User.findOneAndUpdate(
        {
          email,
          username,
        },
        {
          $set: {
            plan: selectedPlan,
            purchaseDate: currentDate,
            shopLimit,
          },
        },
        { new: true, runValidators: true }
      );
      const changeShopPlanResult = await Store.findOneAndUpdate(
        {
          email,
          username,
        },
        {
          $set: {
            plan: selectedPlan,
            purchaseDate: currentDate,
            shopLimit,
          },
        },
        { new: true, runValidators: true }
      );
      res
        .status(StatusCodes.CREATED)
        .json({ newPlanResult, changeUserPlanResult, changeShopPlanResult });
    }
    
  }


  const stripeController = async (req, res) => {
    const { amount } = req.body;
    const amountCents = amount * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.status(StatusCodes.OK).json({ clientSecret: paymentIntent.client_secret });
  };


  const makePayment = async (req, res) => {
    const paymentEmail = req.body.email
    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email
    const username = user?.username
    if(email===paymentEmail) {
        const paymentObject = {
            email,
            username,
            userId,
            transactionId: req.body?.transactionId,
            plan: req.body?.plan,
            price: req.body?.price
        }
        const addPriceToAdmin = await Admin.updateOne({ email: process.env.ADMIN},
        { $inc: { income: req.body?.price } }
        )
        console.log(addPriceToAdmin)
        const result = await Payment.create( paymentObject );
        res.status(StatusCodes.CREATED).json( result );

    } else {
        res.status(StatusCodes.BAD_REQUEST).json( {msg: 'User not found'} );
    }
  }



  module.exports = {
    buyPlan,
    stripeController,
    makePayment
  };