const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { AuthMiddleware } = require("../middleware/AuthMiddleware.js");

function setAuthCookie(res, token) {
  // إعداد الكوكيز مع الخيارات المناسبة
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 أسبوع
  });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // تحقق مما إذا كان المستخدم موجودًا بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 مستوى صعوبة التشفير
    const NewUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    // حفظ المستخدم في قاعدة البيانات
    await NewUser.save();

    // إنشاء وتوقيع JWT
    const token = jwt.sign({ id: NewUser._id,role: NewUser.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    setAuthCookie(res, token);
    res.status(201).json({
      message: "user registered successfully",
      token,
      user: {
        id: NewUser._id,
        name: NewUser.name,
        email: NewUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // تحقق من صحة كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
     // إنشاء وتوقيع JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
    setAuthCookie(res, token);

     res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
