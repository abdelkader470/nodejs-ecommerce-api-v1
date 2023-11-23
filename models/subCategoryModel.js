const mongoose = require("mongoose");

// 1- create Schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "Sub Category must be unique"],
      minLength: [2, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);
// 2- create Model
const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
