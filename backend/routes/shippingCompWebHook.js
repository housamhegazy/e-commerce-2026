
const express = require("express");
const router = express.Router();
const Order = require("../models/orders.js");

// Webhook endpoint for Shipping Company
router.post("/shipping-webhook", async (req, res) => {
  try {
    const { order_id, status } = req.body;

    const order = await Order.findOne({ orderNumber: order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found in our database" });
    }

    // 2. لو الكود وصل هنا، يبقى الأوردر موجود، فنحدث الحالة
    if (status === "delivered") {
      order.status = "Delivered";
      order.isPaid = true; // الطلب وصل والفلوس استُلمت
      order.deliveredAt = Date.now();
    } else if (status === "returned") {
      order.status = "Returned";
      order.isPaid = false; // نضمن إنها false لأن الطلب رجع ومحدش دفع حاجة
    }

    await order.save();
    
    // 3. نرد بالنجاح فقط لو الأوردر اتحدث فعلاً
    res.status(200).send("Webhook Received and Order Updated");

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;