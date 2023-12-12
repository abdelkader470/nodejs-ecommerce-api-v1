const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalPrice;
  return totalPrice;
};
// @desc      create a new Cart
// @route     Post /api/v1/cart
// @access   private/user
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  // 1) Get carrt for Logged User
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    // create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart, push product cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  // calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "product Added to cart successfully",
    data: cart,
  });
});
// @desc      Get logged user cart
// @route     Post /api/v1/cart
// @access   private/user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id :${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
