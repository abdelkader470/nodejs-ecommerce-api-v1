const mongoose = require("mongoose");

// 1- create Schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Product is required"],
      minLength: [3, "Too short Product title"],
      maxLength: [100, "Too long Product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minLength: [20, "Too short Product description"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long Product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    colors: [String],
    size: {
      type: String,
      enum: ["xs", "m", "lg", "xxlg", "xlg", "3xlg"],
    },
    imageCover: {
      type: String,
      required: [true, "Product image Cover is required"],
    },
    images: [String],
    type: {
      type: String,
      enum: ["men", "child", "woman"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Producr must be belong to category"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});
const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
productSchema.post("init", (doc) => {
  setImageUrl(doc);
});
productSchema.post("save", (doc) => {
  setImageUrl(doc);
});
// 2- create Model
const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
