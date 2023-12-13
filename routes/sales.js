const express = require('express');
const { createSale, getSalesCollection, getPagination, getAllUsersAsAdmin, getAllSalesAmount } = require('../controllers/sales');
const router = express.Router();

router.route('/')
.post(createSale)
.get(getSalesCollection)
router.route('/search').get(getPagination)

router.route('/admin/users').get(getAllUsersAsAdmin)
router.route('/all').get(getAllSalesAmount)

module.exports = router;
