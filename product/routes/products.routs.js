const express = require("express");
const router = express.Router();

// ✅ Import controller as an object
const controller = require("../controllers/medicine.controller");
console.log("🔍 controller:", controller);

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = controller;

// ✅ Import middleware
const { protect, isAdmin } = require("../../admin/middleware/middleware");
console.log("🛡️ protect:", protect);
console.log("👑 isAdmin:", isAdmin);


// ✅ Routes
router.get("/", getProducts);
router.post("/add", protect, isAdmin, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
