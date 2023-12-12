const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  removeCartItem,
  clearCart,
  updateCartItemQuantity,
} = require("../services/cartSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.use(authSevices.protect, authSevices.allowedTo("user"));

router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCart)
  .delete(clearCart);
router.route("/:itemId").delete(removeCartItem).put(updateCartItemQuantity);

module.exports = router;
