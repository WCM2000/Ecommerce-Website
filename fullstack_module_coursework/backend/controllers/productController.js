const Product = require("./../models/productModel");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { createOne } = require("./orderController");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log(req.body);
  console.log(file);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Image,Please upload only an Image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.fields([{ name: "images", maxCount: 5 }]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files?.images) return next();
  console.log(req.body);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${req.user._id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2400, 1600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push(filename);
    })
  );

  console.log(req.body);
  next();
});

exports.getImage = catchAsync(async (req, res) => {
  let fileName = req.params.imageName;
  // console.log(path.join(__dirname, "../public/img/phones"));
  let options = {
    root: path.join(__dirname, "../public/img/products"),
    // path: `public/img/phones/${req.params.name}`,
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  res.sendFile(fileName, options, function (err) {
    if (err) {
      // next(err)
      // console.log(err);
      res.status(500).json({
        err,
      });
    } else {
      console.log("Sent:", fileName);
    }
  });
});

exports.searchProducts = catchAsync(async (req, res) => {
  const { search } = req.query;
  console.log(search);

  if (search) {
    await Product.find(
      {
        $or: [
          { brandName: { $regex: search, $options: "i" } },
          { model: { $regex: search, $options: "i" } },
          { ram: { $regex: search, $options: "i" } },
          { processor: { $regex: search, $options: "i" } },
        ],
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
      // .select(
      //   "-images -description -discount -price -createdAt -user -productNumber -category -subCategory -brandname"
      // )
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

exports.createCheckout = async (req, res) => {
  console.log(req.body);
  const { products, userId, subTotal } = req.body;

  const lineItems = products.map((item) => ({
    price_data: {
      currency: "lkr",
      product_data: {
        name: item.itemtitle,
        images: [item.itemimages],
      },
      unit_amount: item.itemprice * 100, // Stripe uses amount in cents
    },
    quantity: item.count,
  }));

  console.log(lineItems);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.FRONTEND_DOMAIN_DEVELOPMENT}/products/success`,
    cancel_url: `${process.env.FRONTEND_DOMAIN_DEVELOPMENT}/products/failed`,
  });

  createOne({ products, userId: userId, subTotal: subTotal });
  return res.json({ id: session.id });
};

// exports.stripeWebHook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case "payment_intent.succeeded":
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   res.send();
// };
exports.createOneProduct = factory.createOne(Product);
exports.getOneProduct = factory.getOne(Product, "", "Product");
// exports.getOneProduct = factory.getOne(Product, {
//   path: "user_virtual",
//   select: "-__v",
// });
exports.getAllProducts = factory.getAll(Product);
exports.updateAProduct = factory.updateOne(Product);
exports.deleteAProduct = factory.deleteOne(Product);
