const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        star: Number,
      },
    ],

    averageRating: { type: Number, default: 0 },
    stock: {
      type: Number,
      required: [true, "Please add the stock quantity"],
      default: 0,
      min: [0, "Stock cannot be less than zero"], // ضمان عدم البيع بالسالب
    },
    sold: {
      type: Number,
      default: 0,
    }, // اختياري: لحساب عدد القطع المباعة فعلياً
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", ProductsSchema);
