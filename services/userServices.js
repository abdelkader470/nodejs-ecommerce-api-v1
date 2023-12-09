const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");

//upload single images
exports.uploadUserImage = uploadSingleImage("profileImg");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);
    req.body.profileImg = filename;
  }
  next();
});
// @desc      Get All Users
// @route    Get /api/v1/users
// @access   private
exports.getUsers = factory.getAll(User);
// @desc      Get Specific  User by id
// @route    Get /api/v1/users/:id
// @access   private
exports.getUser = factory.getOne(User);
// @desc      create a new User
// @route    Post /api/v1/users
// @access   private
exports.createUser = factory.createOne(User);
// @desc      Update User
// @route    Put /api/v1/users/:id
// @access   private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      role: req.body.role,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
// @desc      Delete User
// @route    Delete /api/v1/users/:id
// @access   private
exports.deleteUser = factory.deleteOne(User);
