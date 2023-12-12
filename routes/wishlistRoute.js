const express = require("express");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.use(authSevices.protect, authSevices.allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);
router.delete("/:productId", removeProductFromWishlist);
module.exports = router;
