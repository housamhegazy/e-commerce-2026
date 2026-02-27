const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    // ربط السلة بالمستخدم (مسجل دخول)
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      default: null 
    }, 
    
    // مصفوفة المنتجات داخل السلة
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
          default: 1
        },
        price: { // بنخزن السعر وقت الإضافة عشان لو السعر اتغير في المستقبل
          type: Number,
          required: true
        }
      }
    ],

    // السعر الإجمالي للسلة
    totalPrice: {
      type: Number,
      default: 0
    },

    // بيانات الضيف (تُستخدم فقط إذا كان userId هو null)
    guestInfo: { 
      fullName: String,
      email: { type: String, lowercase: true },
      phone: String,
      sessionId: String // مفيد جداً لتتبع سلة الضيف عبر الـ Cookies أو LocalStorage
    },

    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active"
    }
  },
  {
    timestamps: true,
  }
);

// Middleware: حساب السعر الإجمالي قبل الحفظ (اختياري بس مفيد)
CartSchema.pre("save", async function () {
  const total = this.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  
  this.totalPrice = total;
});

module.exports = mongoose.model("Cart", CartSchema);