const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendInvoiceEmail(toEmail, plan, amount, paymentId) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Subscription Invoice",
    html: `
      <h2>Payment Successful ✅</h2>
      <p><b>Plan:</b> ${plan}</p>
      <p><b>Amount Paid:</b> ₹${amount}</p>
      <p><b>Payment ID:</b> ${paymentId}</p>
      <p>Thank you for subscribing!</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendInvoiceEmail;