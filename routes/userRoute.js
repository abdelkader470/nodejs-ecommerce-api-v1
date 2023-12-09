const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} = require("../services/userServices");
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  CreateUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");

const authSevices = require("../services/authServices");

const router = express.Router();

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(authSevices.protect, authSevices.allowedTo("admin", "manager"), getUsers)
  .post(
    authSevices.protect,
    authSevices.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    CreateUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(
    authSevices.protect,
    authSevices.allowedTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    authSevices.protect,
    authSevices.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authSevices.protect,
    authSevices.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );
module.exports = router;
