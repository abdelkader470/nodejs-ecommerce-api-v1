const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const expressAsyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const factory = require("./handlersFactory");
const Brand = require("../models/brandModel");

//upload single images
exports.uploadBrandImage = uploadSingleImage("image");
//image processing
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.png`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .png({ quality: 95 })
      .toFile(`uploads/brands/${filename}`);
    req.body.image = filename;
  }
  next();
});
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
