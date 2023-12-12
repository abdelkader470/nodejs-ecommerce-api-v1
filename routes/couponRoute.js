const express = require("express");
const {
  getCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponSevices");

const authSevices = require("../services/authServices");

const router = express.Router();

router.use(authSevices.protect, authSevices.allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);
module.exports = router;
