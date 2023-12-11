const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

// @desc      Get All Reviews
// @route     Get /api/v1/reviews
// @access   public
exports.getReviews = factory.getAll(Review);
// @desc      Get Specific Review
// @route     Get /api/v1/reviews/:id
// @access   public
exports.getReview = factory.getOne(Review);
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
