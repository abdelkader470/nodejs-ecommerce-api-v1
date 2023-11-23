const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const ApiError = require("../utils/ApiError");

// @desc      Get All Brands
// @route    Get /api/v1/Brands
// @access   public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ result: brands.length, page, data: brands });
});
// @desc      create a new Brand
// @route    Post /api/v1/Brands
// @access   private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});
// @desc      Get Specific  Brands
// @route    Get /api/v1/Brands/:id
// @access   public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!Brand) {
    return next(new ApiError(`No Brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});
// @desc      Update Brand
// @route    Put /api/v1/Brands/:id
// @access   private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError(`No Brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});
// @desc      Delete Brand
// @route    Delete /api/v1/Brands/:id
// @access   private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`No Brand for this id ${id}`, 404));
  }
  res.status(204).send();
});
