const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.use(authSevices.protect);

router.get(
  "/checkout-session/:cartId",
  authSevices.allowedTo("user"),
  checkoutSession
);

router.route("/:cartId").post(authSevices.allowedTo("user"), createCashOrder);

router.get(
  "/",
  authSevices.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  getAllOrders
);
router.route("/:id").get(getSpecificOrder);
router.put(
  "/:id/pay",
  authSevices.allowedTo("admin", "manager"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  authSevices.allowedTo("admin", "manager"),
  updateOrderToDelivered
);

module.exports = router;
