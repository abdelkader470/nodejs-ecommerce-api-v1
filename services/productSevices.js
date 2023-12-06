const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ApiError = require("../utils/ApiError");

// @desc      Get All Products
// @route    Get /api/v1/Products
// @access   public
exports.getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const Products = await Product.find({})
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
  res.status(200).json({ result: Products.length, page, data: Products });
});
// @desc      create a new Product
// @route    Post /api/v1/Products
// @access   private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});
// @desc      Get Specific  Products
// @route    Get /api/v1/Products/:id
// @access   public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError(`No Product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});
// @desc      Update Product
// @route    Put /api/v1/Products/:id
// @access   private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`No Product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});
// @desc      Delete Product
// @route    Delete /api/v1/Products/:id
// @access   private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No Product for this id ${id}`, 404));
  }
  res.status(204).send();
});
