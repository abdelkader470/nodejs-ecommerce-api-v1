const express = require("express");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productSevices");
const {
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
  createProductValidator,
} = require("../utils/validators/productValidator");

const authSevices = require("../services/authServices");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    authSevices.protect,
    authSevices.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authSevices.protect,
    authSevices.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authSevices.protect,
    authSevices.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );
module.exports = router;
