const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendLanguageOtp(toEmail, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Language Change OTP",
    html: `<h2>Language Change Verification</h2><p>Your OTP is:</p><h3>${otp}</h3><p>Expires in 5 minutes.</p>`,
  });
}

module.exports = sendLanguageOtp;