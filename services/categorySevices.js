const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/ApiError.js");

// @desc      Get All Categories
// @route    Get /api/v1/categories
// @access   public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const cotegories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ result: cotegories.length, page, data: cotegories });
});
// @desc      create a new category
// @route    Post /api/v1/categories
// @access   private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
// @desc      Get Specific  Categories
// @route    Get /api/v1/categories/:id
// @access   public
exports.getcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});
// @desc      Update Category
// @route    Put /api/v1/categories/:id
// @access   private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});
// @desc      Delete Category
// @route    Delete /api/v1/categories/:id
// @access   private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(204).send();
});
