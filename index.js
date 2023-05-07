require("dotenv").config();

const axios = require("axios");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const { format } = require("date-fns");

const API_ENDPOINT = process.env.API_URL;
const EMAIL_RECIPIENT = process.env.EMAIL_RECIPIENT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const INTERVAL = process.env.INTERVAL;
const FAILURE_INTERVAL = process.env.FAILURE_INTERVAL;

const TEST_DATA = [
  {
    locationId: 5080,
    startTimestamp: "2023-05-09T14:45",
    endTimestamp: "2023-05-09T15:00",
    active: true,
    duration: 15,
    remoteInd: false,
  },
  {
    locationId: 5080,
    startTimestamp: "2023-05-09T15:00",
    endTimestamp: "2023-05-09T15:15",
    active: true,
    duration: 15,
    remoteInd: false,
  },
  {
    locationId: 5080,
    startTimestamp: "2023-05-09T15:15",
    endTimestamp: "2023-05-09T15:30",
    active: true,
    duration: 15,
    remoteInd: false,
  },
  {
    locationId: 5080,
    startTimestamp: "2023-05-09T15:45",
    endTimestamp: "2023-05-09T16:00",
    active: true,
    duration: 15,
    remoteInd: false,
  },
  {
    locationId: 5080,
    startTimestamp: "2023-05-09T18:15",
    endTimestamp: "2023-05-09T18:30",
    active: true,
    duration: 15,
    remoteInd: false,
  },
  {
    locationId: 5080,
    startTimestamp: "2023-05-09T18:30",
    endTimestamp: "2023-05-09T18:45",
    active: true,
    duration: 15,
    remoteInd: false,
  },
  {
    locationId: 5080,
    startTimestamp: "2023-05-09T18:45",
    endTimestamp: "2023-05-09T19:00",
    active: true,
    duration: 15,
    remoteInd: false,
  },
  {
    locationId: 5080,
    startTimestamp: "2023-05-10T13:30",
    endTimestamp: "2023-05-10T13:45",
    active: true,
    duration: 15,
    remoteInd: false,
  },
  {
    locationId: 5080,
    startTimestamp: "2023-05-10T14:00",
    endTimestamp: "2023-05-10T14:15",
    active: true,
    duration: 15,
    remoteInd: false,
  },
  {
    locationId: 5080,
    startTimestamp: "2023-05-10T14:15",
    endTimestamp: "2023-05-10T14:30",
    active: true,
    duration: 15,
    remoteInd: false,
  },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy, h:mm aa");
};

const humanizeData = (data) => {
  const tableRows = data
    .map(
      (item) =>
        `
    <tr>
      <td>${formatDate(item.startTimestamp)}</td>
      <td>${formatDate(item.endTimestamp)}</td>
      <td>${item.active ? "Yes" : "No"}</td>
      <td>${item.duration} mins</td>
      <td>${item.remoteInd ? "Yes" : "No"}</td>
    </tr>
        `
    )
    .join("");

  return `
    <h1>Chicago Appointments</h1>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>Start Timestamp</th>
          <th>End Timestamp</th>
          <th>Active</th>
          <th>Duration</th>
          <th>Remote</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    `;
};

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
    html: humanizeData(data),
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

    data.push(...TEST_DATA);

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
