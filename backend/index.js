const express = require("express");
const bodyParser = require("body-parser"); // لاستخدامها لقراءة JSON من الطلبات
const cors = require("cors"); // للسماح لـ frontend بالاتصال بـ backend
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

// ********************** Middleware **********************

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
); 
const userRoute = require("./routes/user")
const productsRoute = require("./routes/products")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const adminDashboard =require("./routes/AdminDashboard")
//للتجربه فقط
const shippingCompWebHook = require("./routes/shippingCompWebHook")

app.get("/", (req, res) => {
  res.send("E-commerce Website!");
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user",userRoute)
app.use("/api/products",productsRoute)
app.use("/api/cart",cartRoute)
app.use("/api/order",orderRoute)
app.use("/admindashboard",adminDashboard)
app.use("/webhook",shippingCompWebHook)
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Connected to MongoDB!");
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Could not connect to MongoDB...", err);
  });
