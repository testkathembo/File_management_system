import React, { useState } from 'react';
import { updateFile } from '../api';

const FileDetailsDialog = ({ file, onFileUpdated }) => {
  const [fileName, setFileName] = useState(file.name);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileUpdate = () => {
    const formData = new FormData();
    formData.append('name', fileName); // Add updated name
    formData.append('directory', file.directory); // Retain directory

    updateFile(file.id, formData)
      .then((response) => {
        alert('File updated successfully!');
        setIsEditing(false); // Exit editing mode
        if (onFileUpdated) onFileUpdated(response.data); // Notify parent component
      })
      .catch((error) => {
        console.error('Failed to update file:', error);
        alert('File update failed.');
      });
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <button onClick={handleFileUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Name: {file.name}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => window.open(file.file, '_blank')}>Download</button>
        </div>
      )}
    </div>
  );
};

export default FileDetailsDialog;


