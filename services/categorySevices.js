const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const {
  getStorage,
  ref,
  getDowmloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const sharp = require("sharp");
const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// initializeApp(config.firebaseConfig);
// const storage = getStorage();
//upload single images
exports.uploadCategoryImage = uploadSingleImage("image");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `categories-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);
    req.body.image = filename;
  }
  next();
});
// @desc      Get All Categories
// @route    Get /api/v1/categories
// @access   public
exports.getCategories = factory.getAll(Category);
// @desc      Get Specific  Categories
// @route    Get /api/v1/categories/:id
// @access   public
exports.getcategory = factory.getOne(Category);
// @desc      create a new category
// @route    Post /api/v1/categories
// @access   private
exports.createCategory = factory.createOne(Category);
// @desc      Update Category
// @route    Put /api/v1/categories/:id
// @access   private
exports.updateCategory = factory.updateOne(Category);
// @desc      Delete Category
// @route    Delete /api/v1/categories/:id
// @access   private
exports.deleteCategory = factory.deleteOne(Category);
