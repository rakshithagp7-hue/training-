const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generatePassword = require("../utils/passwordGenerator");
const sendResetEmail = require("../utils/sendResetEmail");

router.post("/", async (req, res) => {
  try {
    const { identifier } = req.body; // can be email OR phone number

    if (!identifier) {
      return res.status(400).json({ message: "Please provide your email or phone number." });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email or phone number." });
    }

    // Check if user already requested a reset today
    if (user.lastPasswordResetRequest) {
      const lastRequest = new Date(user.lastPasswordResetRequest);
      const now = new Date();
      const isSameDay =
        lastRequest.getFullYear() === now.getFullYear() &&
        lastRequest.getMonth() === now.getMonth() &&
        lastRequest.getDate() === now.getDate();

      if (isSameDay) {
        return res.status(429).json({ message: "You can use this option only one time per day." });
      }
    }

    // Generate new random password (letters only)
    const newPassword = generatePassword(10);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.lastPasswordResetRequest = new Date();
    await user.save();

    // Send the new password to their registered email
        // Send the new password to their registered email
    try {
      await sendResetEmail(user.email, newPassword);
    } catch (emailErr) {
      console.log("Reset email failed to send. New password for", user.email, "is:", newPassword);
    }

    res.json({ message: "A new password has been sent to your registered email. (Check Render logs if not received)" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
});

module.exports = router;