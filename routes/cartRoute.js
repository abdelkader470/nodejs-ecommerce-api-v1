const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
} = require("../services/cartSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.use(authSevices.protect, authSevices.allowedTo("user"));

router.route("/").get(getLoggedUserCart).post(addProductToCart);

module.exports = router;
