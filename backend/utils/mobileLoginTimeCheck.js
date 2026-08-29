function isWithinMobileLoginWindow() {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hour = istTime.getHours();
  return hour >= 10 && hour < 13;
}

module.exports = isWithinMobileLoginWindow;