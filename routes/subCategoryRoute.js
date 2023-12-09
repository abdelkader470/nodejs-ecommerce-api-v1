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

const authSevices = require("../services/authServices");

const router = express.Router({ margeParams: true });
router
  .route("/")
  .get(createFilterObj, getSubCategories)
  .post(
    authSevices.protect,
    authSevices.allowedTo("admin", "manager"),
    setCategoryIdToBady,
    createSubCategoryValidator,
    createSubCategory
  );
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubcategory)
  .put(
    authSevices.protect,
    authSevices.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authSevices.protect,
    authSevices.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
