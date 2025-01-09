import React, { useState, useEffect } from 'react';
import { uploadFile, fetchDirectories } from '../api';

const FileUploadForm = ({ directoryId, onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(''); // To hold the custom file name
  const [directories, setDirectories] = useState([]);
  const [selectedDirectory, setSelectedDirectory] = useState(directoryId || '');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch directories to populate the dropdown
  useEffect(() => {
    fetchDirectories()
      .then((response) => {
        setDirectories(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch directories:', error);
        alert('Error fetching directories. Please check your server.');
      });
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    if (!fileName.trim()) {
      alert('Please provide a name for the file.');
      return;
    }

    if (!selectedDirectory) {
      alert('Please select a directory.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', fileName); // Add the custom file name
    formData.append('directory', selectedDirectory);

    try {
      setIsUploading(true); // Show loading state
      await uploadFile(formData);
      alert('File uploaded successfully!');
      setFile(null); // Reset file input
      setFileName(''); // Reset file name
      document.getElementById('file-input').value = ''; // Reset file input visually
      if (onFileUploaded) onFileUploaded(); // Optional callback to refresh parent UI
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      alert(`Failed to upload the file. ${error.response?.data?.detail || 'Please try again.'}`);
    } finally {
      setIsUploading(false); // Hide loading state
    }
  };

  return (
    <div className="file-upload-form">
      <div className="form-group">
        <label htmlFor="directory-select">Select Directory:</label>
        <select
          id="directory-select"
          className="form-control"
          value={selectedDirectory}
          onChange={(e) => setSelectedDirectory(e.target.value)}
        >
          <option value="">Select a directory</option>
          {directories.map((dir) => (
            <option key={dir.id} value={dir.id}>
              {dir.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mt-3">
        <label htmlFor="file-name">File Name:</label>
        <input
          id="file-name"
          type="text"
          className="form-control"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter a name for the file"
        />
      </div>

      <div className="form-group mt-3">
        <label htmlFor="file-input">Choose File:</label>
        <input
          id="file-input"
          type="file"
          className="form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button
        className="btn btn-primary mt-3"
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUploadForm;
