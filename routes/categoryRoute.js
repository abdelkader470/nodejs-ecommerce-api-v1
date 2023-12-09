const express = require("express");

const {
  getCategories,
  createCategory,
  getcategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categorySevices");
const authSevices = require("../services/authServices");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  CreateCategoryValidator,
} = require("../utils/validators/categoryValidator");
const subcategoriesRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoriesRoute);
router
  .route("/")
  .get(getCategories)
  .post(
    authSevices.protect,
    uploadCategoryImage,
    resizeImage,
    CreateCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getcategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
