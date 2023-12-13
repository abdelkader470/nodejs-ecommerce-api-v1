const express = require("express");
const { createCashOrder } = require("../services/orderSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.use(authSevices.protect, authSevices.allowedTo("user"));

router.route("/:cartId").post(createCashOrder);

module.exports = router;
