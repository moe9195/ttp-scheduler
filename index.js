const axios = require("axios");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const API_ENDPOINT = process.env.API_URL;
const EMAIL_RECIPIENT = process.env.EMAIL_RECIPIENT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const INTERVAL = process.env.INTERVAL;
const FAILURE_INTERVAL = process.env.FAILURE_INTERVAL;

const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "Outlook365", // or another email service
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_RECIPIENT,
    subject: "API Data",
    text: JSON.stringify(data, null, 2),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const fetchData = async () => {
  try {
    const response = await axios.get(API_ENDPOINT);
    const data = response.data;

    data.push("test");
    console.log(data);

    if (data.length > 0) {
      await sendEmail(data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    cron.schedule(FAILURE_INTERVAL, fetchData, { scheduled: false }).start();
  }
};

fetchData();

// Schedule the main task
cron.schedule(INTERVAL, fetchData);
