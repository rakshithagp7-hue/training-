const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/payment", paymentRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.log("MongoDB connection error:", err));