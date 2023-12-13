const express = require('express');
const router = express.Router();
const {createStore, getShopsAsAdmin} = require('../controllers/store');

router.route('/').post(createStore)
router.route('/admin').get(getShopsAsAdmin)


module.exports = router;
