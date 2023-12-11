const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../services/reviewSevices");
const {
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  CreateReviewValidator,
} = require("../utils/validators/reviewValidator");

const authSevices = require("../services/authServices");

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(
    authSevices.protect,
    authSevices.allowedTo("user"),
    CreateReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authSevices.protect,
    authSevices.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authSevices.protect,
    authSevices.allowedTo("admin", "user", "manager"),
    deleteReviewValidator,
    deleteReview
  );
module.exports = router;
