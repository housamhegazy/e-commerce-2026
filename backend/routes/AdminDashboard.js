const express = require("express");
const router = express.Router();
const Order = require("../models/orders.js");

const {
  AuthMiddleware,
  authorize,
} = require("../middleware/AuthMiddleware.js");

// Update Order Status (Admin Only)
router.put(
  "/update-status/:orderId",
  AuthMiddleware,
  authorize("admin"),
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body; // الأدمن بيبعت الحالة الجديدة (Shipped, Delivered, etc.)

      // التأكد إن الحالة المبعوتة واحدة من الحالات المسموح بيها
      const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status update" });
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true },
      );

      if (!order) return res.status(404).json({ message: "Order not found" });

      res
        .status(200)
        .json({ message: `Order status updated to ${status}`, order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

module.exports = router;
