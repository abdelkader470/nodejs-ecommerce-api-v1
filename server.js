const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const { rateLimit } = require("express-rate-limit");
const hpp = require("hpp");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");

//Routes
const mountRoutes = require("./routes");
const { webhookCheckout } = require("./services/orderSevices");

// connect with db
dbConnection();

// express app
const app = express();

// Enable other demains to assess your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

//checkout webhooh
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//Middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Limit each IP to 100 requests per `window` (here, per 15 minutes).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200,
  message: "too many requests from this IP, please try again after 15 minutes",
});
// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

//middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

//Mount Routes.
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this Route ${req.originalUrl}`, 400));
});
// Global Error Handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running at Port ${PORT}`);
});

//Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
