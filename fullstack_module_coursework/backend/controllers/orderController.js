const Order = require("./../models/orderModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.createOneOrder = factory.createOne(Order);
exports.getOneOrder = factory.getOne(Order);
// exports.getOneOrder = factory.getOne(Order, {
//   path: "user_virtual",
//   select: "-__v",
// });
exports.getAllOrders = factory.getAll(Order);
exports.updateAOrder = factory.updateOne(Order);
exports.deleteAOrder = factory.deleteOne(Order);

exports.createOne = async (data) => {
  const doc = await Order.create(data);
};

exports.searchOrders = catchAsync(async (req, res) => {
  const { search } = req.query;
  console.log(search);

  if (search) {
    await Order.find(
      {
        $in: [{ _id: { $regex: search } }],
      }
      // (err, phones) => {
      //   if (err) {
      //     console.log(err);
      //     // res.status(500).json({
      //     //   status: "failed",
      //     //   message: "There was an error...",
      //     // });
      //   }

      //   res.status(200).json(phones);
      // }
    )
      .then((data) => {
        // console.log(data);
        res.status(200).json({
          status: "success",
          message: `${data.length} found...`,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          message: "failed",
          message: err,
        });
      });
  }
});
