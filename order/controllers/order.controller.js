const Order = require("../controllers/models/order.model");
const Medicine = require("../../product/models/medicine");

// ✅ Place Order
const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Medicine.findById(item._id);
        if (!product) return null;
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
        };
      })
    );

    const validItems = populatedItems.filter(Boolean);
    if (validItems.length === 0) {
      return res.status(400).json({ message: "No valid products found in cart" });
    }

    const order = new Order({
      user: req.user._id,
      items: validItems,
      totalAmount,
    });

    await order.save();
    res.status(201).json({ success: true, message: "Order placed", order });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// ✅ Admin: Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Admin fetch error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ✅ User: Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};

// ✅ Delete entire order (admin or user)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this order" });
    }

    await order.deleteOne();
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

// ✅ Remove single product from order (user only)
const removeItemFromOrder = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.user || order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this order" });
    }

    // 🧹 Filter out the item by item._id
    const newItems = order.items.filter(item => item._id.toString() !== itemId);
    if (newItems.length === order.items.length) {
      return res.status(404).json({ message: "Item not found in order" });
    }

    order.items = newItems;

    // 🧮 Recalculate total
    order.totalAmount = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await order.save();

    res.status(200).json({
      success: true,
      message: "Item removed from order",
      order,
    });
  } catch (error) {
    console.error("❌ Error removing item from order:", error.message);
    res.status(500).json({ message: "Failed to remove item from order" });
  }
};


module.exports = {
  placeOrder,
  getAllOrders,
  getMyOrders,
  deleteOrder,
  removeItemFromOrder,
};
