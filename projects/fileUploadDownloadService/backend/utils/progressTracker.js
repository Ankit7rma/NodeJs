const progressTracker = (uploadedBytes, totalBytes) => {
    const progress = (uploadedBytes / totalBytes) * 100;
    console.log(`Upload Progress: ${progress.toFixed(2)}%`);
  };
  
  module.exports = { progressTracker };
  