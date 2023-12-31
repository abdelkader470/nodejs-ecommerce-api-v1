const { default: slugify } = require("slugify");
const { check, body } = require("express-validator");
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
    .withMessage("To long Sub Category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Sub Category must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id format"),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Sub Category id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
