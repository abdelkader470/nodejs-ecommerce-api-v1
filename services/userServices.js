const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const createToken = require("../utils/createToken");
//upload single images
exports.uploadUserImage = uploadSingleImage("profileImg");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.png`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .png({ quality: 95 })
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
// @desc      Get logged User Data
// @route    Get /api/v1/users/getMe
// @access   private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
// @desc      Update logged User password
// @route    Update /api/v1/users/updateMyPassword
// @access   private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = createToken(user._id);
  res.status(200).json({ date: user, token });
});
// @desc      Update logged User Data without (password ,role)
// @route     Update /api/v1/users/updateMe
// @access   private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  res.status(200).json({ date: updatedUser });
});
// @desc      Deactived logged User
// @route     Delete /api/v1/users/deleteMe
// @access   private/protect
exports.deactivedLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false }, { new: true });
  res.status(204).json({ status: "Success" });
});
// @desc      active logged User
// @route     put /api/v1/users/activeMe
// @access   private/protect
exports.activeLoggedUserData = asyncHandler(async (req, res, next) => {
  const activeUser = await User.findByIdAndUpdate(
    req.params.id,
    { active: true },
    { new: true }
  );
  res.status(200).json({ date: activeUser });
});
