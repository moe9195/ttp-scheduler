const cron = require("node-cron");
const { INTERVAL } = require("./config/config");
const fetchData = require("./services/fetchData");
const sendInitialEmail = require("./services/sendInitialEmail");

// Send initial email on startup
sendInitialEmail();

// Schedule the main task
cron.schedule(INTERVAL, fetchData, { runOnInit: false });
