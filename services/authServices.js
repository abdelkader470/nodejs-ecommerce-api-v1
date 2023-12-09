const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
// @desc     Signup
// @route    Get /api/v1/auth/signup
// @access   public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});
// @desc     login
// @route    Get /api/v1/auth/login
// @access   public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("incorrect email or password", 401));
  }
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});
