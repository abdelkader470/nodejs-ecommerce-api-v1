const factory = require("./handlersFactory");
const Brand = require("../models/brandModel");
// @desc      Get All Brands
// @route    Get /api/v1/Brands
// @access   public
exports.getBrands = factory.getAll(Brand);
// @desc      Get Specific  Brands
// @route    Get /api/v1/Brands/:id
// @access   public
exports.getBrand = factory.getOne(Brand);
// @desc      create a new Brand
// @route    Post /api/v1/Brands
// @access   private
exports.createBrand = factory.createOne(Brand);
// @desc      Update Brand
// @route    Put /api/v1/Brands/:id
// @access   private
exports.updateBrand = factory.updateOne(Brand);
// @desc      Delete Brand
// @route    Delete /api/v1/Brands/:id
// @access   private
exports.deleteBrand = factory.deleteOne(Brand);
