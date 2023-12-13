const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  searchProduct,
  addToCheckout,
  getCheckoutList,
  getAllProducts,
} = require("../controllers/product");

router.route('/')
.post(createProduct)
.get(getProducts)
.patch(updateProduct);
router.route('/all').get(getAllProducts)
router.route('/delete/:id').post(deleteProduct)
router.route('/search').get(searchProduct)
router.route('/checkout').post(addToCheckout).get(getCheckoutList)


module.exports = router;
