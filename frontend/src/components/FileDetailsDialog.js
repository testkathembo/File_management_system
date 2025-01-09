import React, { useState } from 'react';
import { updateFile, deleteFile } from '../api';

const FileDetailsDialog = ({ file, onClose, onFileUpdated, onFileDeleted, onNavigateToParent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fileName, setFileName] = useState(file.name);

  // Handle file update (rename functionality)
  const handleUpdateFile = () => {
    if (!fileName.trim()) {
      alert('File name cannot be empty.');
      return;
    }

    const updatedData = { name: fileName, directory: file.directory };
    updateFile(file.id, updatedData)
      .then((response) => {
        alert('File renamed successfully!');
        setIsEditing(false);
        if (onFileUpdated) onFileUpdated(response.data); // Notify parent about the update
      })
      .catch((error) => {
        console.error('Failed to update file:', error);
        alert('Failed to rename the file. Please try again.');
      });
  };

  // Handle file delete
  const handleDeleteFile = () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      deleteFile(file.id)
        .then(() => {
          alert('File deleted successfully!');
          if (onFileDeleted) onFileDeleted(file.id); // Notify parent about the deletion
          onClose(); // Close the dialog after deletion
        })
        .catch((error) => {
          console.error('Failed to delete file:', error);
          alert('Failed to delete the file. Please try again.');
        });
    }
  };

  return (
    <div className="modal" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">File Details</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {!isEditing ? (
              <div>
                <p>
                  <strong>File Name:</strong> {file.name}
                </p>
                <p>
                  <strong>Directory:</strong> {file.directory_name || 'Unknown'}
                </p>
                <p>
                  <strong>Created At:</strong> {new Date(file.created_at).toLocaleString()}
                </p>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => window.open(file.file, '_blank')}
                >
                  Download
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleDeleteFile}>
                  Delete
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
                <button className="btn btn-success btn-sm me-2" onClick={handleUpdateFile}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {file.parent_directory && (
              <button
                className="btn btn-info"
                onClick={() => {
                  if (onNavigateToParent) onNavigateToParent(file.parent_directory);
                  onClose();
                }}
              >
                Navigate to Parent Directory
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsDialog;
