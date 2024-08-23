const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

/* internal import */
const error = require("./middleware/error.middleware");

/* application level connection */
const app = express();

// Configure CORS properly
app.use(cors({
    origin: ["https://ladyish-eight.vercel.app"], // Adjust to match your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    credentials: true, // Allow cookies and authorization headers with requests
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
    ],
}));

app.use(express.json());

/* router level connections */
app.use("/api/custom", require("./routes/customDesign.route"));
app.use("/api/enquiry", require("./routes/enquiry.route"));
app.use("/api/brand", require("./routes/brand.route"));
app.use("/api/category", require("./routes/category.route"));
app.use("/api/product", require("./routes/product.route"));
app.use("/api/store", require("./routes/store.route"));
app.use("/api/user", require("./routes/user.route"));
app.use("/api/cart", require("./routes/cart.route"));
app.use("/api/favorite", require("./routes/favorite.route"));
app.use("/api/review", require("./routes/review.route"));
app.use("/api/payment", require("./routes/payment.route"));
app.use("/api/purchase", require("./routes/purchase.route"));
app.use("/api/corousel", require("./routes/corousel.route"));
app.use("/api/address", require("./routes/address.route"));
app.use("/api/coupon", require("./routes/coupon.route"));

/* global error handler */
app.use(error);

/* connection establishment */
app.get("/", (req, res, next) => {
  try {
    res.status(200).json({
      acknowledgement: true,
      message: "OK",
      description: "The request is OK",
    });
  } catch (err) {
    next(err);
  } finally {
    console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
});

app.post("/predict", async (req, res) => {
  try {
    const { weight, height, age } = req.body;
    console.log(weight, height, age);
    // Validate request parameters

    const url = `http://nikhilverma.pythonanywhere.com/predict?Weight=${weight}&Height=${height}&Age=${age}`;

    // Make a request to the Flask API using Axios
    const response = await axios.get(url);
    const data = response.data;

    // Forward the response from Flask API to the client
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* export application */
module.exports = app;
