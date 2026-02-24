require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// Middleware لتشفير كلمة المرور قبل حفظ المستخدم
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.getSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// دالة لمقارنة كلمة المرور
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);