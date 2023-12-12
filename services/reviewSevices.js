const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

//Nested Route
// @route    Get /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};
// @desc      Get All Reviews
// @route     Get /api/v1/reviews
// @access   public
exports.getReviews = factory.getAll(Review);
// @desc      Get Specific Review
// @route     Get /api/v1/reviews/:id
// @access   public
exports.getReview = factory.getOne(Review);
//Nested Route (Create)
exports.setProductIdAndUserIdToBady = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
// @desc      create a new Review
// @route     Post /api/v1/reviews
// @access   private/protect/user
exports.createReview = factory.createOne(Review);
// @desc      Update Review
// @route     Put /api/v1/reviews/:id
// @access   private/protect/user
exports.updateReview = factory.updateOne(Review);
// @desc      Delete Review
// @route     Delete /api/v1/reviews/:id
// @access   private/protect/user-admin-manager
exports.deleteReview = factory.deleteOne(Review);
