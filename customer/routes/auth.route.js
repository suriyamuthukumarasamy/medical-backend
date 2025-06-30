const express = require('express');
const {
  signup,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/auth.controller');

const router = express.Router();

//  Registration (alias for frontend to use /register)
router.post('/register', signup); // frontend expects /register
// OR replace /signup with /register

//  Login / Logout
router.post('/login', login);
router.post('/logout', logout);

// Get all users
router.get('/allusers', getAllUsers);

//  Get, update, delete user by ID
router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
