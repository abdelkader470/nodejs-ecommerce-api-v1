const express = require("express");
const { addProductToCart } = require("../services/cartSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router
  .route("/")
  .post(authSevices.protect, authSevices.allowedTo("user"), addProductToCart);

module.exports = router;
