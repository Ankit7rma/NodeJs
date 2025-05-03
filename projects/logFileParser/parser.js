const fs = require('fs');
const readline = require('readline');
const { createObjectCsvWriter } = require('csv-writer');
const config = require('./config');

// Function to parse a single log line
const parseLogLine = (line) => {
  const logParts = line.split(config.delimiter);

  // Assuming log format: [timestamp] [method] [url] [status_code] [response_time]
  return {
    timestamp: logParts[0],
    method: logParts[1],
    url: logParts[2],
    status_code: logParts[3],
    response_time: parseFloat(logParts[4]),
  };
};

// Function to parse the log file and aggregate statistics
const parseLogFile = async () => {
  const inputStream = fs.createReadStream(config.inputFilePath);
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  const requestCount = {};
  const responseTimes = [];
  let errorCount = 0;

  for await (const line of rl) {
    const logData = parseLogLine(line);

    // Aggregate request counts per URL
    requestCount[logData.url] = (requestCount[logData.url] || 0) + 1;

    // Collect response times for calculating average response time
    responseTimes.push(logData.response_time);

    // Count errors (e.g., status codes 4xx/5xx)
    if (logData.status_code.startsWith('4') || logData.status_code.startsWith('5')) {
      errorCount++;
    }
  }

  return { requestCount, averageResponseTime: calculateAverage(responseTimes), errorCount };
};
    
// Calculate average response time
const calculateAverage = (responseTimes) => {
  if (responseTimes.length === 0) return 0;
  const sum = responseTimes.reduce((acc, time) => acc + time, 0);
  return sum / responseTimes.length;
};

module.exports = { parseLogFile };
