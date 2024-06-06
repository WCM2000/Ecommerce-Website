const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(authController.protect, reviewController.createOneReview);
router
  .route("/:id")
  .get(reviewController.getOneReview)
  .patch(authController.protect, reviewController.updateAReview)
  .delete(authController.protect, reviewController.deleteAReview);

module.exports = router;
