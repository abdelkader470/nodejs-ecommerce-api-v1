const mongoose = require("mongoose");

// 1- create Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "Order must be belong to user "],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: Number,
    paymentMethodType: {
      type: String,
      default: "cash",
      enum: ["cash", "card"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    DeliveredAt: Date,
  },
  { timestamps: true }
);

// 2- create Model
module.exports = mongoose.model("Order", orderSchema);
