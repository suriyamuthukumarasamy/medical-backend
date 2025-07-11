// routes/order.routes.js
const express = require("express");
const {
  placeOrder,
  getAllOrders,
  getMyOrders,
  deleteOrder,
  removeItemFromOrder,
} = require("../../controllers/order.controller");
const { protect, isAdmin } = require("../../../admin/middleware/middleware");

const router = express.Router();

// ✅ Route to remove item must come BEFORE /:id
router.delete("/:orderId/items/:itemId", protect, removeItemFromOrder);

router.delete("/:id", protect, deleteOrder); // Admin or user can delete entire order
router.post("/", protect, placeOrder);
router.get("/", protect, isAdmin, getAllOrders);
router.get("/my", protect, getMyOrders);

module.exports = router;
