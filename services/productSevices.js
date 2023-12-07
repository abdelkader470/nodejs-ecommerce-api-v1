const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
// @desc      Get All Products
// @route    Get /api/v1/Products
// @access   public
exports.getProducts = asyncHandler(async (req, res) => {
  const documentsCounts = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("Products")
    .limitFields()
    .sort();

  //excute Query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const Products = await mongooseQuery;
  res
    .status(200)
    .json({ result: Products.length, paginationResult, data: Products });
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
exports.getProduct = factory.getOne(Product);
// @desc      Update Product
// @route    Put /api/v1/Products/:id
// @access   private

exports.updateProduct = factory.updateOne(Product);

// @desc      Delete Product
// @route    Delete /api/v1/Products/:id
// @access   private
exports.deleteProduct = factory.deleteOne(Product);
