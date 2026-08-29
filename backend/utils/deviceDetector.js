const { UAParser } = require("ua-parser-js");

function detectDevice(req) {
  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();

  const browser = result.browser.name || "Unknown";
  const os = result.os.name || "Unknown";

  let deviceType = "desktop";
  if (result.device.type === "mobile" || result.device.type === "tablet") {
    deviceType = "mobile";
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  return { browser, os, deviceType, ip };
}

module.exports = detectDevice;