const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Sub Category is required")
    .isLength({ min: 2 })
    .withMessage("To short Sub Category name")
    .isLength({ max: 32 })
    .withMessage("To long Sub Category name"),
  check("category")
    .notEmpty()
    .withMessage("Sub Category must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id format"),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Sub Category id format"),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
