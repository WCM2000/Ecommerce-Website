const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.use("/image/:imageName", productController.getImage);
router.use("/search", productController.searchProducts);
router.use("/create-checkout-session", productController.createCheckout);
// router.use(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   productController.stripeWebHook
// );
router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.createOneProduct
  );
router
  .route("/:id")
  .get(productController.getOneProduct)
  .patch(
    authController.protect,
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateAProduct
  )
  .delete(authController.protect, productController.deleteAProduct);

module.exports = router;
