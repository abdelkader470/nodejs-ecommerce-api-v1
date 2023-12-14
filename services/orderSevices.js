const stripe = require("stripe")(process.env.STRIPE_SECERT);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const factory = require("./handlersFactory");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
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
// @desc      Update Order paid status to paid
// @route     Put /api/v1/orders/:id/pay
// @access   private/Admin-manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no such order with this id:${req.params.id}`, 404)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});
// @desc      Update Order Delivered status
// @route     Put /api/v1/orders/:id/deliver
// @access   private/Admin-manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no such order with this id:${req.params.id}`, 404)
    );
  }
  order.isDelivered = true;
  order.DeliveredAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});
// @desc      Get Checkout session from stripe and send it as response
// @route     Get /api/v1/orders/checkout-session/cartId
// @access   private/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
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
  // 3) create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  // 4) send session to response
  res.status(200).json({ status: "success", data: session });
});
const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;
  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  //create order
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
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
    await Cart.findByIdAndDelete(cartId);
  }
};
// @desc      this webhook will run when stripe payment success paid
// @route     post /webhook-checkout
// @access   private/user
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECERT
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createCardOrder(event.data.object);
  }
  res.status(200).json({ received: true });
});
