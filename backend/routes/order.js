const express = require("express");
const router = express.Router();
const Order = require("../models/orders.js")
const Cart = require("../models/cart.js");
const crypto = require('crypto'); 

const {
  AuthMiddleware,
  authorize,
} = require("../middleware/AuthMiddleware.js");

router.post("/create-order", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    // 1. اسحب السلة بتاعة المستخدم من الداتابيز
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: " cart empty , nothing to order!" });
    }

    // --- توليد رقم الطلب هنا ---
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // "20240520"
    const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase(); // "A1B2"
    const generatedOrderNumber = `ORD-${datePart}-${randomPart}`;
    // 2. حول بيانات السلة لشكل "Items" في الأوردر
    // بنعمل Map عشان نضمن إننا بناخد البيانات اللي محتاجينها بس
    const orderItems = cart.items.map(item => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price 
    }));

    // 3. إنشاء الأوردر
    const order = new Order({
      user: userId,
      orderItems: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: cart.totalPrice,
      orderNumber: generatedOrderNumber, 
    });

    const createdOrder = await order.save();

    // 4. خطوة مهمة جداً: بعد ما الأوردر يتكريت، لازم نمسح السلة!
    // عشان الزبون لما يفتح السلة تاني ميلاقيش الحاجات اللي خلاص اشتراها
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      message: "Order created successfully",
      order: createdOrder,
      orderNumber: createdOrder.orderNumber, // نرجع الرقم للزبون عشان يشوفه
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// الراوت ده لو للأدمن (عشان يشوف كل طلبات الموقع)
router.get("/all-orders",AuthMiddleware,authorize("admin"),async(req,res)=>{
  try {
    const orders = await Order.find().populate("user", "name email")
      .populate("orderItems.product", "title images price"); 

    if(!orders){
      return res.status(400).json({ message: " no orders found !" });
    }
    res.status(200).json(orders)
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
})

// ده للزبون عشان يشوف طلباته هو بس
router.get("/my-orders", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("orderItems.product", "title images price")
      .sort("-createdAt"); // ترتيب من الأحدث للأقدم
    if(!orders){
      return res.status(400).json({ message: " no orders found !" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/cancel-order/:orderId", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    // 1. بندور على الأوردر ونتأكد إنه يخص المستخدم ده
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    // 2. شرط مهم: ميفنعش يلغي الأوردر لو خلاص اتشحن (Shipped) أو وصل (Delivered)
    if (order.status !== "Pending") {
      return res.status(400).json({ 
        message: `Cannot cancel order because it is already ${order.status}` 
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
