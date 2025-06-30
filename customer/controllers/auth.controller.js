const User = require('../../customer/models/user.model'); // Import User model
const bcrypt = require('bcryptjs'); // For hashing and comparing passwords
const { generateTokenAndSetCookie } = require('../utils/generateTokenAndSetCookie'); // JWT helper

// ✅ REGISTER NEW USER
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Validate input
    if (!email || !password || !name || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 2. Prevent admin registration from public
    if (role === "admin") {
      return res.status(403).json({ success: false, message: "Admin registration is not allowed" });
    }

    // 3. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // 6. Generate JWT
    const token = generateTokenAndSetCookie(res, user._id);
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    // 7. Return user (without password)
    const { password: _, ...userData } = user._doc;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      tokenExpiry,
      user: userData,
    });

  } catch (error) {
    console.error("❌ Signup error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ LOGIN USER
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // 2. Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Generate token
    const token = generateTokenAndSetCookie(res, user._id);
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    // 4. Return user data
    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      tokenExpiry,
      user: userData,
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ LOGOUT USER
const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ✅ GET ALL USERS (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ✅ GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ✅ UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ✅ DELETE USER
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ✅ Export all functions
module.exports = {
  signup,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
