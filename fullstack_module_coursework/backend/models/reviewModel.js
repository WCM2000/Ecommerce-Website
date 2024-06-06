const mongoose = require("mongoose");
const slugify = require("slugify");

// Product schema

const reviewSchema = new mongoose.Schema(
  {
    comment: { type: String },
    ratings: {
      type: String,
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    product: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
  // { typeKey: "$type" }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "-__v -passwordChangedAt -password ",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
