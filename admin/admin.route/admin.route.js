const express = require('express');
const router = express.Router();

const { 
  addProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} = require('../admin.controller/admin.product.controller');

const { protect } = require('../middleware/middleware'); // Auth middleware
const { isAdmin } = require('../middleware/role.middleware'); // Role check middleware

// 📦 Public Routes (optional)
router.get('/', getAllProducts);           // Get all products
router.get('/:id', getProductById);        // Get product by ID

// 🔐 Admin Protected Routes
router.post('/add', protect, isAdmin, addProduct);      // Add product
router.put('/:id', protect, isAdmin, updateProduct);    // Update product
router.delete('/:id', protect, isAdmin, deleteProduct); // Delete product

module.exports = router;
