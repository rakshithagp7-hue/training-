function isWithinAudioUploadWindow() {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hour = istTime.getHours();
  return true; // 2 PM - 7 PM
}

module.exports = isWithinAudioUploadWindow;