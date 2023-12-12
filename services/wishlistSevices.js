const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc     Add Product To Wishlist
// @route    Post /api/v1/wishlist
// @access   private/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product added successfully to your wishlist",
    data: user.wishlist,
  });
});
// @desc     remove Product from Wishlist
// @route    Delete /api/v1/wishlist
// @access   private/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product removed successfully from your wishlist",
    data: user.wishlist,
  });
});
// @desc     Get Logged User Wishlist
// @route    Get /api/v1/wishlist
// @access   prodtected/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
