const express = require("express");
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandSevices");
const {
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  CreateBrandValidator,
} = require("../utils/validators/brandValidator");

const authSevices = require("../services/authServices");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authSevices.protect,
    authSevices.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    CreateBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authSevices.protect,
    authSevices.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authSevices.protect,
    authSevices.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );
module.exports = router;
