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
exports.protect = asyncHandler(async (req, res, next) => {
  //1) check if token exists if exists get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("please login first to get access this route ", 401)
    );
  }
  //2) verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("the user that belongs to this token does not exist", 401)
    );
  }
  //4) check if the user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangeTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangeTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password, please login again ...",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});
