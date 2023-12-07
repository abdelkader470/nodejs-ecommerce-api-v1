const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const SubCategory = require("../models/subCategoryModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
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
  const documentsCounts = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  //excute Query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const subCotegories = await mongooseQuery;

  res.status(200).json({
    result: subCotegories.length,
    paginationResult,
    data: subCotegories,
  });
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
exports.getSubcategory = factory.getOne(SubCategory);
// @desc      Update Sub Category
// @route    Put /api/v1/subcategories/:id
// @access   private

exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc      Delete Sub Category
// @route    Delete /api/v1/subcategories/:id
// @access   private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
