import React, { useState, useEffect } from 'react';
import { uploadFile, fetchDirectories } from '../api';

const FileUploadForm = ({ directoryId, onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [directories, setDirectories] = useState([]);
  const [selectedDirectory, setSelectedDirectory] = useState(directoryId || '');
  const [isUploading, setIsUploading] = useState(false); // To show a loading state

  useEffect(() => {
    // Fetch directories to populate the dropdown
    fetchDirectories()
      .then((response) => setDirectories(response.data))
      .catch((error) => console.error('Failed to fetch directories:', error));
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    if (!selectedDirectory) {
      alert('Please select a directory.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', selectedDirectory);

    try {
      setIsUploading(true); // Show loading state
      await uploadFile(formData);
      alert('File uploaded successfully!');
      setFile(null); // Reset file input
      if (onFileUploaded) onFileUploaded(); // Optional callback to refresh parent UI
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      alert(`Failed to upload the file. ${error.response?.data?.detail || 'Please try again.'}`);
    } finally {
      setIsUploading(false); // Hide loading state
    }
  };

  return (
    <div>
      <label htmlFor="directory-select">Select Directory:</label>
      <select
        id="directory-select"
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

      <label htmlFor="file-input">Choose File:</label>
      <input
        id="file-input"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUploadForm;
