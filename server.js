const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");
const mongoose = require("mongoose");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const globalError = require("./middlewares/errorMiddleware");
const ApiError = require("./utils/ApiError");

// connect with db
dbConnection();

// express app
const app = express();

//Middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes.
app.use("/api/v1/categories", categoryRoute);

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
