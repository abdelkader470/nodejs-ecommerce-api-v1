const express = require("express");
const {
  getCategories,
  createCategory,
  getcategory,
  updateCategory,
  deleteCategory,
} = require("../services/categorySevices");
const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
router
  .route("/:id")
  .get(getcategory)
  .put(updateCategory)
  .delete(deleteCategory);
module.exports = router;
