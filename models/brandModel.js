const mongoose = require("mongoose");

// 1- create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand is required"],
      unique: [true, "Brand must be unique"],
      minLength: [3, "Too short Brand name"],
      maxLength: [32, "Too long Brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
// 2- create Model
const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
