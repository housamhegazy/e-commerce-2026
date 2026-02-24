const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema(
  {
    // ربط الأوردر بالمستخدم (اختياري لو ضيف)
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      default: null 
    }, 
    
    // بيانات الضيف (تُستخدم فقط إذا كان user هو null)
    guestInfo: { 
      fullName: String,
      email: { type: String, lowercase: true },
      phone: String
    },

    // تفاصيل المنتجات المطلوبة
    orderItems: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true 
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true } 
      }
    ],

    // عنوان الشحن (يفضل تحديده بوضوح لسهولة البحث)
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: String,
      country: { type: String, required: true },
    },

    paymentMethod: { 
      type: String, 
      required: true, 
      enum: ['PayPal', 'Stripe', 'Cash on Delivery'] 
    },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date }, // تاريخ الدفع مهم جداً للمحاسبة
    
    totalPrice: { type: Number, required: true, default: 0.0 },
    
    status: { 
      type: String, 
      default: 'Processing',
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'] 
    },
    
    deliveredAt: { type: Date } // تاريخ التوصيل الفعلي
  },
  {
    timestamps: true, // بيضيف createdAt و updatedAt تلقائياً
  }
);

module.exports = mongoose.model("Order", OrdersSchema);