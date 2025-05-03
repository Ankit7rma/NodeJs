import { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorBoundary from '../src/ErrorBoundary';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
  
    const fetchFiles = async () => {
      try {
        console.log('Fetching files...');
        const { data } = await axios.get('http://localhost:3000/files', {
          signal: controller.signal
        });
        console.log('Files fetched:', data);
        setFiles(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Error fetching files:', err);
          setError(err.response?.data?.error || err.message);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchFiles();
    return () => controller.abort();
  }, []);

  const handleDownload = (filename) => {
    window.location.href = `http://localhost:3000/files/download/${encodeURIComponent(filename)}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Uploaded Files</h2>
      {files.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {files.map((file) => (
            <li key={file} style={{ margin: '10px 0' }}>
              {file}
              <button 
                onClick={() => handleDownload(file)}
                style={{ marginLeft: '10px' }}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files available</p>
      )}
    </div>
  );
};
 
export default FileList;
