const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const express = require("express");

const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");
const globalError = require("./middlewares/errorMiddleware");
const ApiError = require("./utils/ApiError");

// connect with db
dbConnection();

// express app
const app = express();

//Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes.
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", reviewRoute);

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
