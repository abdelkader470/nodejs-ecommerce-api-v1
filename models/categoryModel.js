const mongoose = require("mongoose");

// 1- create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});
// 2- create Model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
