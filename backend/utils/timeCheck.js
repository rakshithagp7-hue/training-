function isWithinPaymentWindow() {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hour = istTime.getHours();
  return hour === 10;
}

module.exports = isWithinPaymentWindow;