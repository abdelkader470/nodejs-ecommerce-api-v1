const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc      Get All Brands
// @route    Get /api/v1/Brands
// @access   public
exports.getBrands = asyncHandler(async (req, res) => {
  const documentsCounts = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  //excute Query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const brands = await mongooseQuery;
  res
    .status(200)
    .json({ result: brands.length, paginationResult, data: brands });
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
exports.getBrand = factory.getOne(Brand);
// @desc      Update Brand
// @route    Put /api/v1/Brands/:id
// @access   private

exports.updateBrand = factory.updateOne(Brand);

// @desc      Delete Brand
// @route    Delete /api/v1/Brands/:id
// @access   private

exports.deleteBrand = factory.deleteOne(Brand);
