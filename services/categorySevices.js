const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
// @desc      Get All Categories
// @route    Get /api/v1/categories
// @access   public
exports.getCategories = asyncHandler(async (req, res) => {
  const documentsCounts = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  //excute Query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;
  res
    .status(200)
    .json({ result: categories.length, paginationResult, data: categories });
});
// @desc      create a new category
// @route    Post /api/v1/categories
// @access   private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
// @desc      Get Specific  Categories
// @route    Get /api/v1/categories/:id
// @access   public
exports.getcategory = factory.getOne(Category);
// @desc      Update Category
// @route    Put /api/v1/categories/:id
// @access   private

exports.updateCategory = factory.updateOne(Category);

// @desc      Delete Category
// @route    Delete /api/v1/categories/:id
// @access   private
exports.deleteCategory = factory.deleteOne(Category);
