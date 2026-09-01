const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory");
const authMiddleware = require("../middleware/authMiddleware");
const detectDevice = require("../utils/deviceDetector");
const generateOtp = require("../utils/generateOtp");
const sendLoginOtp = require("../utils/sendLoginOtp");
const isWithinMobileLoginWindow = require("../utils/mobileLoginTimeCheck");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, phone });
    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const { browser, os, deviceType, ip } = detectDevice(req);

    if (deviceType === "mobile" && !isWithinMobileLoginWindow()) {
      return res.status(403).json({
        message: "Mobile login is only allowed between 10:00 AM and 1:00 PM.",
      });
    }

    if (browser === "Chrome") {
      const otp = generateOtp();
      user.loginOtp = otp;
      user.loginOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      console.log("LOGIN OTP for", user.email, "is:", otp);

      try {
        await sendLoginOtp(user.email, otp);
        console.log("Login OTP email sent successfully to", user.email);
      } catch (emailErr) {
        console.log("Login OTP email FAILED to send:", emailErr.message);
      }

            return res.json({
        otpRequired: true,
        email: user.email,
        message: "OTP sent to your registered email. (Check console/logs if not received)",
        debugOtp: otp,
      });
    }

    await LoginHistory.create({ userId: user._id, browser, os, deviceType, ip });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

router.post("/verify-login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid request" });

    if (!user.loginOtp || user.loginOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.loginOtpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired, please log in again" });
    }

    user.loginOtp = undefined;
    user.loginOtpExpires = undefined;
    await user.save();

    const { browser, os, deviceType, ip } = detectDevice(req);
    await LoginHistory.create({ userId: user._id, browser, os, deviceType, ip });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
});

router.get("/login-history", authMiddleware, async (req, res) => {
  try {
    const history = await LoginHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch login history", error: err.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    notificationsEnabled: req.user.notificationsEnabled,
  });
});

router.put("/notifications", authMiddleware, async (req, res) => {
  try {
    req.user.notificationsEnabled = req.body.enabled;
    await req.user.save();
    res.json({ message: "Preference updated", notificationsEnabled: req.user.notificationsEnabled });
  } catch (err) {
    res.status(500).json({ message: "Failed to update preference", error: err.message });
  }
});

router.put("/phone", authMiddleware, async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required." });
    }
    req.user.phone = phone;
    await req.user.save();
    res.json({ message: "Phone number updated successfully.", phone });
  } catch (err) {
    res.status(500).json({ message: "Error updating phone number", error: err.message });
  }
});

module.exports = router;