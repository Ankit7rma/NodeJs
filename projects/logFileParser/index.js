const fs = require('fs');
const { parseLogFile } = require('./parser');
const { createObjectCsvWriter } = require('csv-writer');
const config = require('./config');

// Function to write summary stats to a CSV file
const writeStatsToCsv = async (summary) => {
  const csvWriter = createObjectCsvWriter({
    path: config.outputFilePath,
    header: [
      { id: 'url', title: 'URL' },
      { id: 'request_count', title: 'Request Count' },
      { id: 'average_response_time', title: 'Avg. Response Time (ms)' },
      { id: 'error_count', title: 'Error Count' },
    ],
  });

  const records = Object.keys(summary.requestCount).map((url) => ({
    url,
    request_count: summary.requestCount[url],
    average_response_time: summary.averageResponseTime.toFixed(2),
    error_count: summary.errorCount,
  }));

  await csvWriter.writeRecords(records);
  console.log('Summary written to CSV.');
};

// Main execution
const runParser = async () => {
  try {
    const summary = await parseLogFile();
    await writeStatsToCsv(summary);
  } catch (err) {
    console.error('Error parsing log file:', err);
    fs.appendFileSync(config.errorLogPath, `${new Date().toISOString()} - ${err.message}\n`);
  }
};

runParser();
