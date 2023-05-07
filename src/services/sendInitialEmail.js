const fs = require("fs");
const { sendEmail } = require("../services/sendEmail");
const { EMAIL_USER, EMAIL_RECIPIENT } = require("../config/config");

const fileName = "restart.txt";

const sendInitialEmail = async () => {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  try {
    const fileContent = fs.readFileSync(fileName, "utf-8");
    const fileTimestamp = new Date(fileContent);

    if (fileTimestamp > thirtyMinutesAgo) {
      console.log("Start App Email already sent");
      return;
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("File doesn't exist, creating...");
      fs.writeFileSync(fileName, now.toString());
    } else {
      console.error("Error reading file:", error);
      return;
    }
  }

  fs.writeFileSync(fileName, now.toString());

  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_RECIPIENT,
    subject: "App Restarted",
    text: "The application has been restarted by PM2.",
  };

  try {
    await sendEmail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendInitialEmail;
