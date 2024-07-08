const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const upload = require("express-fileupload");
const { connect } = require("mongoose");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require("dotenv").config();

const app = express();

// MiddleWares 
app.use(express.json({ extended: true })); // Middleware to parse JSON - payload. Cannot parse response returned from a form.
app.use(express.urlencoded({ extended: true })); // Middleware to pare Urlencoded - payload. Can parse response returned form a form
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Middleware to handle cors error
app.use(upload());// Allows the server to accept file uploads

// Routes
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// For error Handling
app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI)
  .then(
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Listening at port ${process.env.PORT}...`);
    })
  )
  .catch((e) => console.log(e));


























































































// bun00KqwyeJsKBsF
