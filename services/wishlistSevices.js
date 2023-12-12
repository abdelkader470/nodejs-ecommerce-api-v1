const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");

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
