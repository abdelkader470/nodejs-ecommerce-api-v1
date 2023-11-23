const express = require("express");
const {
  getSubCategories,
  createSubCategory,
  getSubcategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBady,
  createFilterObj,
} = require("../services/subCategorySevices");
const {
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  createSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router({ margeParams: true });
router
  .route("/")
  .get(createFilterObj, getSubCategories)
  .post(setCategoryIdToBady, createSubCategoryValidator, createSubCategory);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubcategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;
