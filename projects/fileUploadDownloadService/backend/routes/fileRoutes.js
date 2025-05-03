const express = require('express');
const router = express.Router();
const { 
  uploadFile, 
  downloadFile, 
  getFiles 
} = require('../controllers/fileController'); // Include getFiles

// Endpoints
router.get('/', getFiles); // List files
router.post('/upload', uploadFile);
router.get('/download/:filename', downloadFile);

module.exports = router;
