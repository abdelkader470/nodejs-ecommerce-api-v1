const express = require("express");
const {
  addProductToWishlist,
  removeProductFromWishlist,
} = require("../services/wishlistSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.post(
  "/",
  authSevices.protect,
  authSevices.allowedTo("user"),
  addProductToWishlist
);
router.delete(
  "/:productId",
  authSevices.protect,
  authSevices.allowedTo("user"),
  removeProductFromWishlist
);
module.exports = router;
