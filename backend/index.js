const express = require("express");
const bodyParser = require("body-parser"); // لاستخدامها لقراءة JSON من الطلبات
const cors = require("cors"); // للسماح لـ frontend بالاتصال بـ backend
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

// ********************** Middleware **********************

app.use(express.json()); // عشان السيرفر يفهم الـ JSON اللي جاي من الفرونت
app.use(cookieParser()); // ضروري لقراءة التوكن من الكوكيز
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
); // تفعيل CORS للسماح لـ frontend (الذي يعمل على منفذ مختلف) بالاتصال بـ backend
const userRoute = require("./routes/user")
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user",userRoute)

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Connected to MongoDB!");
    // مش هنشغل السيرفر إلا لما الداتابيز تشبك
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Could not connect to MongoDB...", err);
  });
