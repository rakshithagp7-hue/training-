// Mock SMS sender — no real SMS gateway (like Twilio) is set up,
// so this simulates sending an OTP by logging it to the server console.
async function sendSmsOtp(phone, otp) {
  console.log(`📱 [MOCK SMS] Sending OTP ${otp} to phone number: ${phone}`);
  return true;
}

module.exports = sendSmsOtp;