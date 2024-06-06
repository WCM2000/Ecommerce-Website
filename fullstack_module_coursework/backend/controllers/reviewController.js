const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");

exports.createOneReview = factory.createOne(Review);
exports.getOneReview = factory.getOne(Review);
// exports.getOneReview = factory.getOne(Review, {
//   path: "user_virtual",
//   select: "-__v",
// });
exports.getAllReviews = factory.getAll(Review);
exports.updateAReview = factory.updateOne(Review);
exports.deleteAReview = factory.deleteOne(Review);
