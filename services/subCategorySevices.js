const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const SubCategory = require("../models/subCategoryModel");

// @desc      Get All Sub Categories
// @route    Get /api/v1/subcategories
// @access   public
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subCotegories = await SubCategory.find(req.filterObj)
    .skip(skip)
    .limit(limit);

  res
    .status(200)
    .json({ result: subCotegories.length, page, data: subCotegories });
});
// @desc      create a new Sub Category
// @route    Post /api/v1/subcategories
// @access   private
exports.setCategoryIdToBady = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});
// @desc      Get Specific Sub  Categories
// @route    Get /api/v1/subcategories/:id
// @access   public
exports.getSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    return next(new ApiError(`No Sub Category for this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});
// @desc      Update Sub Category
// @route    Put /api/v1/subcategories/:id
// @access   private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subCategory) {
    return next(new ApiError(`No Sub Category for this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});
// @desc      Delete Sub Category
// @route    Delete /api/v1/subcategories/:id
// @access   private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`No Sub Category for this id ${id}`, 404));
  }
  res.status(204).send();
});
