const express = require("express");
const router = express.Router();
const Product = require("../models/products.js");
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
  "/delete-product/:productId",AuthMiddleware,
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

module.exports = router;
