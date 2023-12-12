const express = require("express");
const { addProductToWishlist } = require("../services/wishlistSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.route("/").post(
  authSevices.protect,
  authSevices.allowedTo("user"),

  addProductToWishlist
);

module.exports = router;
