require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const audioTweetRoutes = require("./routes/audioTweetRoutes");
const languageRoutes = require("./routes/languageRoutes");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", languageRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/forgot-password", forgotPasswordRoutes);
app.use("/api/audio-tweet", audioTweetRoutes);
app.use("/uploads", express.static("uploads"));

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.log("MongoDB connection error:", err));