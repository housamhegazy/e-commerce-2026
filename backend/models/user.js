require("dotenv").config();
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // ملاحظة: مونيجوس بيعمل الـ _id تلقائياً، مفيش داعي لتعريفه إلا لو هتعمله Custom
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    address: {
      city: String,
      street: String,
      zipCode: String,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // استخدام enum أفضل للأمان
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // التصحيح هنا
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);