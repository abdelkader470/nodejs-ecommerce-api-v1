const mongoose = require("mongoose");

// 1- create Schema
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon is required"],
      unique: [true, "Coupon must be unique"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire time required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value required"],
    },
  },
  { timestamps: true }
);

// 2- create Model
module.exports = mongoose.model("Coupon", couponSchema);
