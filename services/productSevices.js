const { v4: uuidv4 } = require("uuid");
// const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //1-image processing for image cover
  // if (req.files.imageCover) {
  //   const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  //   await sharp(req.files.imageCover[0].buffer)
  //     .resize(2000, 1333)
  //     .toFormat("jpeg")
  //     .jpeg({ quality: 95 })
  //     .toFile(`uploads/products/${imageCoverFileName}`);
  //   //save image to db
  //   req.body.imageCover = imageCoverFileName;
  // }
  //2-image processing for images
  // if (req.files.images) {
  //   req.body.images = [];
  //   await Promise.all(
  //     req.files.images.map(async (img, index) => {
  //       const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
  //       await sharp(img.buffer)
  //         .resize(2000, 1333)
  //         .toFormat("jpeg")
  //         .jpeg({ quality: 95 })
  //         .toFile(`uploads/products/${imageName}`);
  //       //save image to db
  //       req.body.images.push(imageName);
  //     })
  //   );
  //   next();
  // }
});
// @desc      Get All Products
// @route    Get /api/v1/Products
// @access   public
exports.getProducts = factory.getAll(Product, "Products");
// @desc      Get Specific  Products
// @route    Get /api/v1/Products/:id
// @access   public
exports.getProduct = factory.getOne(Product);
// @desc      create a new Product
// @route    Post /api/v1/Products
// @access   private
exports.createProduct = factory.createOne(Product);
// @desc      Update Product
// @route    Put /api/v1/Products/:id
// @access   private
exports.updateProduct = factory.updateOne(Product);
// @desc      Delete Product
// @route    Delete /api/v1/Products/:id
// @access   private
exports.deleteProduct = factory.deleteOne(Product);
