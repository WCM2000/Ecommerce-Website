const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();


const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const reviewRouter = require("./routes/reviewRoute");
const orderRouter = require("./routes/orderRoute");

app.use(express.json({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(cors());
app.options("*", cors());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}



app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

module.exports = app;
