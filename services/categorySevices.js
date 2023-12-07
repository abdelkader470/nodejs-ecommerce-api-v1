const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
// @desc      Get All Categories
// @route    Get /api/v1/categories
// @access   public
exports.getCategories = factory.getAll(Category);
// @desc      Get Specific  Categories
// @route    Get /api/v1/categories/:id
// @access   public
exports.getcategory = factory.getOne(Category);
// @desc      create a new category
// @route    Post /api/v1/categories
// @access   private
exports.createCategory = factory.createOne(Category);
// @desc      Update Category
// @route    Put /api/v1/categories/:id
// @access   private
exports.updateCategory = factory.updateOne(Category);
// @desc      Delete Category
// @route    Delete /api/v1/categories/:id
// @access   private
exports.deleteCategory = factory.deleteOne(Category);
