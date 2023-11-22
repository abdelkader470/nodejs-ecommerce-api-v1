const express = require("express");
const {
  getCategories,
  createCategory,
  getcategory,
  updateCategory,
  deleteCategory,
} = require("../services/categorySevices");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  CreateCategoryValidator,
} = require("../utils/validators/categoryValidator");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(CreateCategoryValidator, createCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getcategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
