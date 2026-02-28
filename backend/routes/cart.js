const express = require("express");
const router = express.Router();
const Product = require("../models/products.js");
const Cart = require("../models/cart.js");

const {
  AuthMiddleware,
  authorize,
} = require("../middleware/AuthMiddleware.js");

router.post("/add-to-cart/:productId", AuthMiddleware, async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id;

    // 1. التأكد من وجود المنتج
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // 2. لو السلة جديدة، بنضيف المنتج والكمية هتكون 1 تلقائياً من الـ Schema default
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            price: product.price,
            // هنا مش محتاج تكتب quantity لأن الـ Schema فيه default: 1
          },
        ],
      });
    } else {
      // 3. البحث عن المنتج في السلة الحالية
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        // 4. المنتج موجود فعلاً -> نزود الكمية بـ 1 فقط
        cart.items[itemIndex].quantity += 1;
      } else {
        // 5. المنتج مش موجود -> نضيفه كعنصر جديد (والكمية هتكون 1 تلقائياً)
        cart.items.push({
          productId,
          price: product.price,
        });
      }
    }

    // 6. حفظ السلة (الـ Middleware هيحسب السعر الإجمالي هنا)
    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update product quantity (Increase / Decrease)
router.put("/update-quantity/:productId", AuthMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity  = Number(req.body.quantity); 
    const userId = req.user.id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Please provide a valid quantity (min 1)" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Quantity updated", cart });
    } else {
      res.status(404).json({ message: "Product not in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my-cart", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title images price", // بنجيب بس الحاجات اللي هنعرضها في السلة
    });

    if (!cart) {
      return res.status(200).json({ items: [], totalPrice: 0 });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete-product/:productId", AuthMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // 1. نبحث عن سلة المستخدم
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 2. نمسح المنتج من مصفوفة items باستخدام $pull
    // الميزة هنا إننا بنمسح المنتج ده بس من جوه السلة
    cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId: productId } } },
      { new: true } // عشان نرجع السلة بعد التعديل
    );

    res.status(200).json({ 
      message: "Product removed from cart successfully", 
      cart 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
