const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const {
  AuthMiddleware,
  authorize,
} = require("../middleware/AuthMiddleware.js");

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
    const token = jwt.sign(
      { id: NewUser._id, role: NewUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
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
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/profile", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/logout", AuthMiddleware, async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// add address
router.post("/add-address", AuthMiddleware, async (req, res) => {
  try {
    const { title, city, street, zipCode, isDefault } = req.body;
    const userId = req.user.id;
    if (isDefault) {
      await User.updateOne(
        { _id: userId },
        { $set: { "addresses.$[].isDefault": false } }, // علامة $[] بتعدل كل العناصر في المصفوفة
      );
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: { title, city, street, zipCode, isDefault } } },
      { new: true },
    );
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update address
router.put("/update-address/:addressId", AuthMiddleware, async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const userId = req.user.id;
    const { title, city, street, zipCode, isDefault } = req.body;
    if (isDefault) {
      await User.updateOne(
        { _id: userId },
        { $set: { "addresses.$[].isDefault": false } }, // علامة $[] بتعدل كل العناصر في المصفوفة
      );
    }
    // البحث عن المستخدم وتعديل العنوان الذي يطابق الـ ID
    const user = await User.findOneAndUpdate(
      { _id: userId, "addresses._id": addressId }, // البحث باليوزر وبالعنوان المحدد
      {
        $set: {
          "addresses.$.title": title,
          "addresses.$.city": city,
          "addresses.$.street": street,
          "addresses.$.zipCode": zipCode,
          "addresses.$.isDefault": isDefault,
        },
      },
      { new: true, runValidators: true }, // إرجاع البيانات الجديدة وتفعيل التحقق
    );

    if (!user) {
      return res.status(404).json({ message: "Address or User not found" });
    }

    res.status(200).json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete address 
router.delete("/delete-address/:addressId", AuthMiddleware, async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    // استخدام $pull لمسح العنوان المحدد من مصفوفة العناوين
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { addresses: { _id: addressId } }
      },
      { new: true } // لإرجاع بيانات المستخدم بعد الحذف
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Address deleted successfully", 
      addresses: user.addresses 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
