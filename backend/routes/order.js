const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const Product = require("../models/products.js");
const Order = require("../models/orders.js")
const {
  AuthMiddleware,
  authorize,
} = require("../middleware/AuthMiddleware.js");

router.post("/create-order",async(req,res)=>{
  try {
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})
module.exports = router;
