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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactivedLoggedUser,
  activeLoggedUserData,
} = require("../services/userServices");
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  CreateUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const authSevices = require("../services/authServices");

const router = express.Router();

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router.get("/getMe", authSevices.protect, getLoggedUserData, getUser);

router.put("/changeMePassword", authSevices.protect, updateLoggedUserPassword);

router.delete("/deactivedMe", authSevices.protect, deactivedLoggedUser);

router.put("/activeMe/:id", activeLoggedUserData);

router.put(
  "/updateMe",
  authSevices.protect,
  updateLoggedUserValidator,
  updateLoggedUserData
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
