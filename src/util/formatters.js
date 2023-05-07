const { format } = require("date-fns");

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy, h:mm aa");
};

module.exports = {
  humanizeData,
  formatDate,
};
