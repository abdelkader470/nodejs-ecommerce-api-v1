const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  filterOrderForLoggedUser,
} = require("../services/orderSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.use(authSevices.protect);

router.route("/:cartId").post(authSevices.allowedTo("user"), createCashOrder);
router.get(
  "/",
  authSevices.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  getAllOrders
);
router.route("/:id").get(getSpecificOrder);

module.exports = router;
