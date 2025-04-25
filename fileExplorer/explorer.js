// Node.js script that recursively explores a directory and its subdirectories, 
// listing files (optionally filtered by extension) and directories, along with their details like size and type.

const fs = require('fs').promises;
const path = require('path');

// Function to explore a directory
async function exploreDirectory(dirPath, extension = '') {
  try {
    // Read the directory
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    // Loop through each item in the directory
    for (const item of items) {
      // Get the full path of the item
      const fullPath = path.join(dirPath, item.name);

      // Get item stats (size, type, etc.)
      const stats = await fs.stat(fullPath);

      // Determine type (file or directory)
      const type = item.isDirectory() ? 'directory' : 'file';

      // If it's a file and matches the extension (or no extension filter), display it
      if (type === 'file' && (extension === '' || path.extname(item.name) === extension)) {
        console.log(`File: ${fullPath}, Size: ${stats.size} bytes, Type: ${type}`);
      } else if (type === 'directory') {
        // If it's a directory, display it and recurse into it
        console.log(`Directory: ${fullPath}, Type: ${type}`);
        await exploreDirectory(fullPath, extension); // Recursive call
      }
    }
  } catch (error) {
    // Handle errors like permission denied
    console.error(`Error reading ${dirPath}: ${error.message}`);
  }
}

// Test the function
(async () => {
  const directoryPath = './'; // Current directory
  const extensionFilter = '.js'; // Filter for .js files
  console.log(`Exploring directory: ${directoryPath}`);
  await exploreDirectory(directoryPath, extensionFilter);
})();