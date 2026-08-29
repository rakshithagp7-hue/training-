const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendLoginOtp(toEmail, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Login OTP",
    html: `
      <h2>Login Verification</h2>
      <p>Your OTP code is:</p>
      <h3>${otp}</h3>
      <p>This code expires in 5 minutes.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendLoginOtp;