const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");
// @desc      Get All Sub Categories
// @route    Get /api/v1/subcategories
// @access   public
exports.setCategoryIdToBady = (req, res, next) => {
  //Nested Route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
//Nested Route
// @route    Get /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
exports.getSubCategories = factory.getAll(SubCategory);
// @desc      Get Specific Sub  Categories
// @route    Get /api/v1/subcategories/:id
// @access   public
exports.getSubcategory = factory.getOne(SubCategory);
// @desc      create a new Sub Category
// @route    Post /api/v1/subcategories
// @access   private
exports.createSubCategory = factory.createOne(SubCategory);
// @desc      Update Sub Category
// @route    Put /api/v1/subcategories/:id
// @access   private
exports.updateSubCategory = factory.updateOne(SubCategory);
// @desc      Delete Sub Category
// @route    Delete /api/v1/subcategories/:id
// @access   private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
