const factory = require("./handlersFactory");
const Coupon = require("../models/couponModel");

// @desc      Get All Coupons
// @route    Get /api/v1/coupons
// @access   private/Admin-Manager
exports.getCoupons = factory.getAll(Coupon);
// @desc      Get Specific Coupons
// @route    Get /api/v1/coupons/:id
// @access   private/Admin-Manager
exports.getCoupon = factory.getOne(Coupon);
// @desc     create  Coupon
// @route    Post /api/v1/coupons
// @access   private/Admin-Manager
exports.createCoupon = factory.createOne(Coupon);
// @desc     Update Coupon
// @route    Put /api/v1/coupons/:id
// @access  private/Admin-Manager
exports.updateCoupon = factory.updateOne(Coupon);
// @desc      Delete Coupon
// @route    Delete /api/v1/coupons/:id
// @access   private/Admin-Manager
exports.deleteCoupon = factory.deleteOne(Coupon);
