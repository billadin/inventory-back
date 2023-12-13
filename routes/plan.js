const express = require('express');
const router = express.Router();
const { buyPlan, stripeController, makePayment } = require('../controllers/plan');

router.route('/').post(buyPlan)
router.route('/stripe').post(stripeController)
router.route('/payment').post(makePayment)


module.exports = router;
