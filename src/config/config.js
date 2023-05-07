require("dotenv").config();

module.exports = {
  API_ENDPOINT: process.env.API_URL,
  EMAIL_RECIPIENT: process.env.EMAIL_RECIPIENT,
  EMAIL_USER: process.env.EMAIL_USER,
  INTERVAL: process.env.INTERVAL,
  FAILURE_INTERVAL: process.env.FAILURE_INTERVAL,
};
