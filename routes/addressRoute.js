const express = require("express");
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/addressSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.use(authSevices.protect, authSevices.allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);
router.delete("/:addressId", removeAddress);
module.exports = router;
