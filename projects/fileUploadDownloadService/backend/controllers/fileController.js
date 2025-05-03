const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
// Ensure this exists in your controller
const getFiles = async (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    const files = await fs.promises.readdir(uploadDir);
    res.json(files.filter(file => !file.startsWith('.')));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read directory' });
  }
};


const uploadFile = (req, res) => {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = req.headers['file-name'];
  if (!fileName) {
    return res.status(400).json({ error: 'Missing file name header' });
  }

  const filePath = path.join(uploadDir, fileName);
  const fileStream = fs.createWriteStream(filePath);

  req.pipe(fileStream)
    .on('finish', () => {
      res.status(201).json({ message: 'File uploaded successfully' });
    })
    .on('error', (err) => {
      console.error('Upload error:', err);
      fileStream.destroy();
      fs.unlinkSync(filePath);
      res.status(500).json({ error: 'File upload failed' });
    });
};

const downloadFile = (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).json({ error: 'Download failed' });
    }
  });
};

module.exports = { getFiles, uploadFile, downloadFile };
