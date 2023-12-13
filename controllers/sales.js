const mongoose = require('mongoose')
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User')
const Product = require('../models/Product');
const Sales = require('../models/Sales');
const { BadRequestError } = require('../errors');
const { calculateTotals } = require('../utils/helper');


const createSale = async (req, res) => {

    const productArray = req?.body
    const productIds = productArray.map(product => product._id);
    const {
      totalCost,
      totalProfit,
      totalDiscount,
      totalSellingPrice,
    } = calculateTotals(productArray);

    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email
    const totalSales = productArray.length;

    const salesUser = await Sales.findOne({ email });

    if(!salesUser) {
        const salesResult = await Sales.create({
            email,
            userId,
            soldProducts: productArray,
            salesCount: totalSales,
            totalInvest: totalCost,
            totalProfit: totalProfit
        })
        const productResult = await Product.updateMany(
              { email, "products._id": { $in: productIds} },
              {
                $inc: {
                  "products.$[].saleCount": totalSales,
                  "products.$[].quantity": -totalSales,
                },
              },
              { new: true, runValidators: true }
            );
            const cartResult = await User.updateOne({ email },
                { $set: { cart: [] } });
        res.status(StatusCodes.CREATED).json({ salesResult, productResult });
    }
    else {
        const salesResult = await Sales.updateOne({ email },
        { $push: { soldProducts : productArray },
          $inc: {
            salesCount: totalSales,
            totalInvest: totalCost,
            totalProfit: totalProfit
          }
        });
        const productResult = await Product.updateMany(
            { email, "products._id": { $in: productIds} },
            {
              $inc: {
                "products.$[].saleCount": totalSales,
                "products.$[].quantity": -totalSales,
              },
            },
            { new: true, runValidators: true }
          );
          const cartResult = await User.updateOne({ email },
            { $set: { cart: [] } });
          res.status(StatusCodes.OK).json({ salesResult, productResult });
    }
  }

  const getSalesCollection = async (req, res) => {

    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email
    const sales = await Sales.findOne({ email,userId})
    const sortedProducts = sales?.soldProducts?.sort((a, b) => new Date(b.soldDate) - new Date(a.soldDate));

    if(sales) {
      const salesObject = {
        totalSales : sales.salesCount,
        totalInvest: sales.totalInvest,
        totalProfit: sales.totalProfit
      }
      res.status(StatusCodes.OK).json({saleProducts: sortedProducts, salesObject});
    } else {
      const salesObject = {
        totalSales : 0,
        totalInvest: 0,
        totalProfit: 0
      }
      res.status(StatusCodes.OK).json({saleProducts: sortedProducts,salesObject});
    }
  }

  const getPagination = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email

    const salesExist = await Sales.findOne({ email,userId})
    let salesObject;
    salesExist ?
    salesObject = {
      totalSales : salesExist.salesCount,
      totalInvest: salesExist.totalInvest,
      totalProfit: salesExist.totalProfit
    } :
    salesObject = {
      totalSales : 0,
      totalInvest: 0,
      totalProfit: 0
    }

    const limit =  5;
    const page = Number(req.query?.page) || 1
    const skip = (page -1) *  limit

    let  monthlyApplications = await Sales.aggregate([
      { $match: { email } },
      
      { $unwind: '$soldProducts' }, 
      { $sort: { 'soldProducts.soldDate': -1 } },
      {
        $group: {
          _id: '$_id',
          soldProducts: { $push: '$soldProducts' }
        }
      },
      {
        $project: {
          soldProducts: {
            $slice: ['$soldProducts', skip, limit]
          }
        }
      },
    ]).exec();
    
    const desiredProductList = monthlyApplications[0]
    
    // const sortedProducts = desiredProductList?.soldProducts.sort((a, b) => new Date(b.soldDate) - new Date(a.soldDate));
    // const result = sortedProducts;
    const result = desiredProductList?.soldProducts;
    const sales = await Sales.findOne({ email,userId})
    const totalCount = sales?.soldProducts.length;


    const pageCount = Math.ceil(totalCount / limit);
    res.status(StatusCodes.OK).json({totalCount, result, pageCount, page, salesObject});
  }


  const getAllUsersAsAdmin = async (req, res) =>  {

    const userId = req.user.userId
    const user = await User.findOne( { _id: userId } );
    const email  = user?.email
    //Verify email == Admin here, if user not admin throw error
    const limit = 10;
    const page = Number(req.query?.page) || 1
    const skip = (page -1) *  limit

    const allUsers = await User.find().skip(skip).limit(limit)
    const totalCount = await User.find().estimatedDocumentCount()
    const pageCount = Math.ceil(totalCount / limit);

    console.log(totalCount, pageCount, page)
    res.status(StatusCodes.OK).json({totalCount, pageCount, page, allUsers});

  }

  const getAllSalesAmount = async (req, res) => {
    const allSales = await Sales.find()
    const totalSalesCount = allSales.reduce((accumulator, currentValue) => {
      if (currentValue.salesCount !== undefined) {
        accumulator += currentValue.salesCount;
      }
      return accumulator;
    }, 0);
    res.status(StatusCodes.OK).json({totalSales: totalSalesCount});
  }

  module.exports = {
    createSale,
    getSalesCollection,
    getPagination,
    getAllUsersAsAdmin,
    getAllSalesAmount
  };