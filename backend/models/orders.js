const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    address: String,
    city: String,
    phone: String
  },
  paymentMethod: { type: String, required: true }, // "Card", "Cash"
  paymentResult: { // بيانات من بوابة الدفع
    id: String,
    status: String,
    update_time: String
  },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  status: { type: String, default: "Pending" }, // Pending, Shipped, Delivered
  orderNumber: {
    type: String,
    unique: true, // عشان ميتكررش أبداً
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrdersSchema);