import React, { useState, useEffect } from 'react';
import {
  fetchDirectories,
  fetchFiles,
  fetchSubDirectories,
  createDirectory,
  deleteDirectory,
  renameDirectory,
} from '../api';
import FileDetailsDialog from './FileDetailsDialog';
import FileUploadForm from './FileUploadForm';

const DirectoryPage = () => {
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState(null);
  const [newDirectoryName, setNewDirectoryName] = useState('');
  const [renameDirectoryId, setRenameDirectoryId] = useState(null);
  const [renameDirectoryName, setRenameDirectoryName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // For showing file details
  const [showUploadForm, setShowUploadForm] = useState(false); // Toggle upload form

  // Fetch directories and files for the current directory
  useEffect(() => {
    if (currentDirectory) {
      fetchSubDirectories(currentDirectory.id).then((res) => setDirectories(res.data));
      fetchFiles(currentDirectory.id).then((res) => setFiles(res.data));
    } else {
      fetchDirectories().then((res) => setDirectories(res.data));
      fetchFiles().then((res) => setFiles(res.data));
    }
  }, [currentDirectory]);

  // Create a new directory
  const handleCreateDirectory = () => {
    if (!newDirectoryName.trim()) {
      alert('Please enter a directory name.');
      return;
    }
    createDirectory({ name: newDirectoryName, parent: currentDirectory?.id }).then(() => {
      alert('Directory created successfully!');
      setNewDirectoryName('');
      fetchDirectories().then((res) => setDirectories(res.data));
    });
  };

  // Delete a directory
  const handleDeleteDirectory = (directoryId) => {
    deleteDirectory(directoryId)
      .then(() => {
        alert('Directory deleted successfully!');
        setDirectories((prevDirectories) =>
          prevDirectories.filter((dir) => dir.id !== directoryId)
        );
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.error || 'Cannot delete a non-empty directory.');
        } else {
          console.error('Failed to delete directory:', error);
          alert('An unexpected error occurred.');
        }
      });
  };

  // Rename a directory
  const handleRenameDirectory = () => {
    if (!renameDirectoryId || !renameDirectoryName.trim()) {
      alert('Please enter a valid name for the directory.');
      return;
    }
    renameDirectory(renameDirectoryId, { name: renameDirectoryName }).then(() => {
      alert('Directory renamed successfully!');
      setDirectories(
        directories.map((dir) =>
          dir.id === renameDirectoryId ? { ...dir, name: renameDirectoryName } : dir
        )
      );
      setRenameDirectoryId(null);
      setRenameDirectoryName('');
    });
  };

  // File deletion handler (for file details dialog)
  const handleFileDeleted = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header text-center">
          <h1>{currentDirectory ? `Directory: ${currentDirectory.name}` : 'Root Directory'}</h1>
        </div>
        <div className="card-body">
          {/* Button to go to parent directory */}
          {currentDirectory && (
            <button
              className="btn btn-secondary mb-3"
              onClick={() => setCurrentDirectory(currentDirectory.parent || null)}
            >
              Go to Parent Directory
            </button>
          )}
          {!currentDirectory && <p className="text-center">You are in the Root Directory</p>}

          {/* Button to go to the High-Level Page */}
          <div className="text-center mb-3">
            <a href="/high-level" className="btn btn-info">
              View High-Level Directories and Files
            </a>
          </div>

          {/* Directories Section */}
          <div className="card-body">
            <div className="card w-50 mx-auto">
              <div className="card-header text-center">
                <h2>Directories</h2>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {directories.map((dir) => (
                    <li
                      key={dir.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <button
                        className="btn btn-link"
                        onClick={() => setCurrentDirectory(dir)}
                      >
                        {dir.name}
                      </button>
                      <div>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => {
                            setRenameDirectoryId(dir.id);
                            setRenameDirectoryName(dir.name);
                          }}
                        >
                          Rename
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteDirectory(dir.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <h3 className="text-center mt-3">Create New Directory</h3>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New Directory Name"
                    value={newDirectoryName}
                    onChange={(e) => setNewDirectoryName(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleCreateDirectory}>
                    Create Directory
                  </button>
                </div>
                {renameDirectoryId && (
                  <div className="mt-3">
                    <h4>Rename Directory</h4>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="New Directory Name"
                        value={renameDirectoryName}
                        onChange={(e) => setRenameDirectoryName(e.target.value)}
                      />
                      <button className="btn btn-success" onClick={handleRenameDirectory}>
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setRenameDirectoryId(null);
                          setRenameDirectoryName('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="card-body">
            <div className="card w-50 mx-auto">
              <div className="card-header text-center">
                <h2>Files</h2>
              </div>
              <ul className="list-group">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <button
                      className="btn btn-link"
                      onClick={() => setSelectedFile(file)}
                    >
                      {file.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* File Upload Form */}
          <div className="text-center mt-4">
            <button
              className="btn btn-success"
              onClick={() => setShowUploadForm(!showUploadForm)}
            >
              {showUploadForm ? 'Hide Upload Form' : 'Upload File'}
            </button>
          </div>
          {showUploadForm && <FileUploadForm directoryId={currentDirectory?.id} />}

          {/* File Details Dialog */}
          {selectedFile && (
            <FileDetailsDialog
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
              onFileDeleted={handleFileDeleted}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
