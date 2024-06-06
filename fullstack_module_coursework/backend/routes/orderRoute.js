const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.use("/search", orderController.searchOrders);

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(authController.protect, orderController.createOneOrder);
router
  .route("/:id")
  .get(orderController.getOneOrder)
  .patch(authController.protect, orderController.updateAOrder)
  .delete(authController.protect, orderController.deleteAOrder);

module.exports = router;
