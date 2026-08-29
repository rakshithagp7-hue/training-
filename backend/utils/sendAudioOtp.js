const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendAudioOtp(toEmail, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Audio Tweet OTP",
    html: `<h2>Audio Upload Verification</h2><p>Your OTP is:</p><h3>${otp}</h3><p>Expires in 5 minutes.</p>`,
  });
}

module.exports = sendAudioOtp;