const axios = require("axios");
const { humanizeData, formatDate } = require("../util/formatters");
const { sendEmail } = require("../services/sendEmail");

const {
  API_ENDPOINT,
  EMAIL_USER,
  EMAIL_RECIPIENT,
  FAILURE_INTERVAL,
} = require("../config/config");

const fetchData = async () => {
  try {
    const response = await axios.get(API_ENDPOINT);
    const data = response.data;

    if (data.length > 0) {
      const mailOptions = {
        from: EMAIL_USER,
        to: EMAIL_RECIPIENT,
        subject: "API Data",
        html: humanizeData(data),
      };

      await sendEmail(mailOptions);
    }
  } catch (error) {
    console.error("Error fetching data:", error);

    const mailOptions = {
      from: EMAIL_USER,
      to: EMAIL_RECIPIENT,
      subject: "API Failure",
      text: `There was an error fetching data from the API at ${formatDate(
        new Date()
      )} with message ${error.message}.`,
    };

    await sendEmail(mailOptions);

    cron.schedule(FAILURE_INTERVAL, fetchData, { scheduled: false }).start();
  }
};

module.exports = fetchData;
