function generatePassword(length = 10) {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const allChars = upper + lower;

  let password = "";
  // Ensure at least one uppercase and one lowercase letter
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];

  for (let i = 2; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password so the guaranteed chars aren't always first
  password = password.split("").sort(() => Math.random() - 0.5).join("");

  return password;
}

module.exports = generatePassword;