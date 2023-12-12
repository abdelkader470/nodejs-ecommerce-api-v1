const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  removeCartItem,
} = require("../services/cartSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.use(authSevices.protect, authSevices.allowedTo("user"));

router.route("/").get(getLoggedUserCart).post(addProductToCart);
router.route("/:itemId").delete(removeCartItem);

module.exports = router;
