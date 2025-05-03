import { useState, useRef } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      await axios.post('http://localhost:3000/files/upload', file, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'file-name': file.name,
          'file-size': file.size,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      // alert('File uploaded successfully');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Upload Error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px', maxWidth: '500px' }}>
      <h2>Upload File</h2>
      
      <input 
        type="file" 
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'block', margin: '10px 0' }}
      />
      
      <button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        style={{
          padding: '8px 16px',
          backgroundColor: isUploading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadProgress > 0 && (
        <div style={{ marginTop: '15px' }}>
          <progress 
            value={uploadProgress} 
            max="100" 
            style={{ width: '100%', height: '20px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{uploadProgress}%</span>
            <span>{file?.name}</span>
          </div>
        </div>
      )}

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
