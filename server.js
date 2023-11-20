const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");
const mongoose = require("mongoose");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const app = express();

// Database Connection
dbConnection();
//Middleware
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Routes.
app.use("/api/v1/categories", categoryRoute);

//listen
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App Running at Port ${PORT}`);
});
