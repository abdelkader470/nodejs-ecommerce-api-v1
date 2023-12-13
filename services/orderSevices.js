const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const factory = require("./handlersFactory");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
// @desc      create cash Order
// @route    Post /api/v1/orders/:cartId
// @access   private/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //app Settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart depand on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) return next(new ApiError("There is no cart for this id", 404));
  // 2) Get Order price depand on cart price "check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) create order with default PaymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  //4) After creating the order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    // 5) clear cart depand on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "success", data: order });
});
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filerObj = { user: req.user._id };
  next();
});
// @desc      Get All Orders
// @route     Get /api/v1/orders
// @access   private/user-Admin-manager
exports.getAllOrders = factory.getAll(Order);
// @desc      Get Specific Order
// @route     Get /api/v1/orders/:id
// @access   private/user-Admin-manager
exports.getSpecificOrder = factory.getOne(Order);
