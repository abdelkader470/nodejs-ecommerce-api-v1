const Product = require("../models/productModel");
const factory = require("./handlersFactory");
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
