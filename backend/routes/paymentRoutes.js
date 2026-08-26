const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Subscription = require("../models/Subscription");
const PLANS = require("../config/plans");
const isWithinPaymentWindow = require("../utils/timeCheck");
const sendInvoiceEmail = require("../utils/sendEmail");
const authMiddleware = require("../middleware/authMiddleware");

// STEP A: Create a mock order (simulates Razorpay's create-order step)
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    if (!isWithinPaymentWindow()) {
      return res.status(403).json({ message: "Payments are allowed only between 10:00 AM and 11:00 AM IST." });
    }

    const { plan } = req.body; // "Bronze" / "Silver" / "Gold"
    if (!PLANS[plan] || plan === "Free") {
      return res.status(400).json({ message: "Invalid plan selected." });
    }

    const amount = PLANS[plan].price;
    // Generate a fake order id, same shape as a real gateway would give
    const orderId = "order_" + crypto.randomBytes(8).toString("hex");

    res.json({ orderId, amount, plan });
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

// STEP B: Confirm the mock payment (simulates the gateway's "payment successful" callback)
router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    if (!isWithinPaymentWindow()) {
      return res.status(403).json({ message: "Payments are allowed only between 10:00 AM and 11:00 AM IST." });
    }

    const { orderId, plan } = req.body;
    if (!orderId || !PLANS[plan] || plan === "Free") {
      return res.status(400).json({ message: "Invalid payment details." });
    }

    // Generate a fake payment id (mock gateway confirmation)
    const paymentId = "pay_" + crypto.randomBytes(8).toString("hex");
    const planData = PLANS[plan];

    let sub = await Subscription.findOne({ userId: req.user._id });

    if (sub) {
      sub.plan = plan;
      sub.tweetLimit = planData.tweetLimit;
      sub.tweetsUsed = 0;
      sub.amountPaid = planData.price;
      sub.paymentId = paymentId;
      sub.startDate = new Date();
      await sub.save();
    } else {
      sub = await Subscription.create({
        userId: req.user._id,
        plan,
        tweetLimit: planData.tweetLimit,
        amountPaid: planData.price,
        paymentId,
      });
    }

    // Send invoice email
    await sendInvoiceEmail(req.user.email, plan, planData.price, paymentId);

    res.json({ message: "Payment successful, subscription activated!", subscription: sub });
  } catch (err) {
    res.status(500).json({ message: "Error verifying payment", error: err.message });
  }
});

module.exports = router;