const express = require('express');
const router = express.Router();

const { register, login, registerAsAdmin, checkIsAdmin, checkIsShopCreated, loginAsAdmin } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/login/admin', loginAsAdmin);
router.post('/register/admin', registerAsAdmin);
router.post('/admin', checkIsAdmin);
router.get('/shop', checkIsShopCreated);

module.exports = router;
