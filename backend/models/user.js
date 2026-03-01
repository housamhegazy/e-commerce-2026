require("dotenv").config();
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // ملاحظة: مونيجوس بيعمل الـ _id تلقائياً، مفيش داعي لتعريفه إلا لو هتعمله Custom
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    addresses: [
      {
        title: { type: String, default: "Home" }, // مثلاً: Home, Office
        city: { type: String, required: true },
        street: { type: String, required: true },
        zipCode: String,
        isDefault: { type: Boolean, default: false } // عشان يحدد عنوان أساسي للشحن
      }
    ],
    role: { type: String, enum: ["user", "admin"], default: "user" }, // استخدام enum أفضل للأمان
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // التصحيح هنا
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);