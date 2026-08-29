const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResetEmail(toEmail, newPassword) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Password Has Been Reset",
    html: `
      <h2>Password Reset Successful 🔑</h2>
      <p>Your new password is:</p>
      <h3 style="letter-spacing: 2px;">${newPassword}</h3>
      <p>Please log in and change this password if you'd like.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendResetEmail;