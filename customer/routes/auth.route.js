const express = require('express');
const {
  signup,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUserByAdmin,
} = require('../controllers/auth.controller');

const { protect, isAdmin } = require('../../admin/middleware/middleware');

const router = express.Router();

// Public registration
router.post('/register', signup);

// Login / logout
router.post('/login', login);
router.post('/logout', logout);

// Admin creates user (including admin)
router.post('/create', protect, isAdmin, createUserByAdmin);

// Get all users
router.get('/allusers', protect, isAdmin, getAllUsers);

// Get / update / delete user by ID
router
  .route('/:id')
  .get(protect, isAdmin, getUserById)
  .put(protect, isAdmin, updateUser)
  .delete(protect, isAdmin, deleteUser);

module.exports = router;
