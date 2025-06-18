const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductsById, updateProduct, deleteProduct } = require('../controllers/medicine.controller');
// const { protect } = require('../../seller/tokenVerify/tokenVerify');

router.post('/add' ,createProduct);
router.get('/' , getProducts);
router.get('/:id', getProductsById);
router.put('/:id' , updateProduct);
router.delete('/:id' , deleteProduct);

module.exports = router;