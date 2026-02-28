const express = require("express");
const router = express.Router();
const Product = require("../models/products.js");
const User = require("../models/user.js");
const {
  AuthMiddleware,
  authorize,
} = require("../middleware/AuthMiddleware.js");

const {
  cloudinary,
  bufferToDataUri,
  upload,
} = require("../utils/cloudinary.js");

router.post(
  "/create-product",
  AuthMiddleware,
  authorize("admin"),
  upload.array("images"),
  async (req, res) => {
    try {
      const { title, description, price, category, stock } = req.body;
      const adminId = req.user.id;

      // 1. التحقق من وجود صور
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ message: "Please upload at least one image" });
      }

      // 2. مصفوفة لتخزين بيانات الصور بعد الرفع
      const imagesArray = [];
      // 3. الرفع لكلاوديناري باستخدام Loop
      for (const file of req.files) {
        const fileUri = bufferToDataUri(file.mimetype, file.buffer);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "product_images",
        });

        // دفع البيانات بالشكل اللي الموديل بتاعك محتاجه
        imagesArray.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
      //create product
      const newProduct = new Product({
        title,
        description,
        price,
        category,
        stock,
        images: imagesArray,
        createdBy: adminId,
      });
      await newProduct.save();
      res
        .status(201)
        .json({ message: "product created successfully", product: newProduct });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);
//update product (only admin)
router.put(
  "/update-product/:productId",
  AuthMiddleware,
  authorize("admin"),
  upload.array("images"),
  async (req, res) => {
    try {
      const adminId = req.user.id;
      const productId = req.params.productId;
      const { title, description, price, category, stock } = req.body;

      let product = await Product.findOne({
        _id: productId,
        createdBy: adminId,
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found or unauthorized" });
      }
      //  تجهيز البيانات للتحديث
      const updateData = {
        title,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
      };

      if (req.files && req.files.length > 0) {
        const imagesArray = [];

        // رفع الصور الجديدة
        for (const file of req.files) {
          const fileUri = bufferToDataUri(file.mimetype, file.buffer);
          const result = await cloudinary.uploader.upload(fileUri, {
            folder: "product_images",
          });
          imagesArray.push({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }

        // إضافة الصور الجديدة للبيانات التي سيتم تحديثها
        updateData.images = imagesArray;

        //  مسح الصور القديمة من Cloudinary لتوفير المساحة
        for (const img of product.images) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      // 4. تنفيذ التحديث
      product = await Product.findByIdAndUpdate(
        productId,
        { $set: updateData },
        { new: true, runValidators: true }, // new عشان يرجع المنتج بعد التعديل
      );

      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);
//delete product by admin
router.delete(
  "/delete-product/:productId",
  AuthMiddleware,
  authorize("admin"),
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const adminId = req.user.id;

      let product = await Product.findOne({
        _id: productId,
        createdBy: adminId,
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found or unauthorized" });
      }

      //  مسح الصور من Cloudinary أولاً
      // بنلف على مصفوفة الصور ونمسح كل واحدة باستخدام الـ public_id
      if (product.images && product.images.length > 0) {
        for (const img of product.images) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      // 3. مسح المنتج نهائياً من قاعدة البيانات
      await Product.findByIdAndDelete(productId);

      res.status(200).json({
        success: true,
        message:
          "Product and its images deleted successfully from Cloudinary and Database",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);
//get all products for cusromers
router.get("/all-products", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 }); // يرجع الأحدث أولاً
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found at the moment" });
    }
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all products in dashboard to admin
router.get(
  "/admin-products",
  AuthMiddleware,
  authorize("admin"),
  async (req, res) => {
    try {
      const createdBy = req.user.id;
      const products = await Product.find({ createdBy })
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 }); // يرجع الأحدث أولاً

      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found at the moment" });
      }
      res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);
//product details
router.get("/product-details/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).populate(
      "createdBy",
      "name email",
    );
    if (!product) {
      return res.status(4000).json({ message: "no product found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//add products to user wishlist
router.post("/wishlist/:productId", AuthMiddleware, async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user.wishlist.includes(productId)) {
      // لو موجود يشيله (Toggle)
      user.wishlist.pull(productId);
      await user.save();
      return res.status(200).json({ message: "Removed from wishlist" });
    }
    user.wishlist.push(productId);
    await user.save();
    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all user wishlist products
router.get("/wishlist", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate("wishlist", "title description category stock price images")
      .select("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/rate-product/:productId", AuthMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { star, comment } = req.body;
    const userId = req.user.id;

    // 1. التحقق من صحة عدد النجوم (من 1 لـ 5)
    if (!star || star < 1 || star > 5) {
      return res
        .status(400)
        .json({ message: "Please provide a rating between 1 and 5 stars" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2. هل المستخدم ده قيم المنتج ده قبل كدة؟ (عشان ميكررش تقييمه)
    const alreadyRated = product.ratings.find(
      (r) => r.userId.toString() === userId.toString(),
    );

    if (alreadyRated) {
      // لو قيم قبل كدة، نحدث تقييمه القديم
      await Product.updateOne(
        { _id: productId, "ratings.userId": userId },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
      );
    } else {
      // لو أول مرة، نضيف تقييم جديد للمصفوفة
      product.ratings.push({ userId, star, comment });
      await product.save();
    }

    // 3. الخطوة السحرية: إعادة حساب متوسط التقييمات
    const updatedProduct = await Product.findById(productId);
    const totalRatings = updatedProduct.ratings.length;
    const sumStars = updatedProduct.ratings.reduce(
      (acc, item) => item.star + acc,
      0,
    );

    // تحديث الـ averageRating في الداتابيز
    updatedProduct.averageRating = (sumStars / totalRatings).toFixed(1); // رقم واحد بعد العلامة
    await updatedProduct.save();

    res.status(200).json({
      message: "Rating submitted successfully",
      averageRating: updatedProduct.averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete rate
router.delete("/rate-product/:productId", AuthMiddleware, async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id;
    // 1. استخدام $pull لمسح التقييم الخاص بالمستخدم ده فقط من المصفوفة
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        $pull: { ratings: { userId: userId } },
      },
      { new: true }, // يرجع المنتج بعد التعديل
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2. إعادة حساب المتوسط بعد المسح
    const totalRatings = product.ratings.length;
    let newAverage = 0;

    if (totalRatings > 0) {
      const sumStars = product.ratings.reduce(
        (acc, item) => item.star + acc,
        0,
      );
      newAverage = (sumStars / totalRatings).toFixed(1);
    }
    // 3. تحديث المتوسط في الداتابيز
    product.averageRating = newAverage;
    await product.save();
    res.status(200).json({
      message: "Rating deleted successfully",
      averageRating: product.averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
