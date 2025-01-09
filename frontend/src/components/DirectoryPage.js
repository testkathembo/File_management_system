import React, { useState, useEffect } from 'react';
import {
  fetchDirectories,
  fetchSubDirectories,
  fetchFiles,
  createDirectory,
  deleteDirectory,
  deleteFile,
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

  const handleCreateDirectory = () => {
    if (!newDirectoryName.trim()) {
      alert('Please enter a directory name.');
      return;
    }
    createDirectory({ name: newDirectoryName, parent: currentDirectory?.id }).then(() => {
      alert('Directory created successfully!');
      setNewDirectoryName('');
      fetchDirectories().then((res) => setDirectories(res.data)); // Refresh
    });
  };

  const handleDeleteDirectory = (directoryId) => {
    deleteDirectory(directoryId).then(() => {
      alert('Directory deleted successfully!');
      setDirectories(directories.filter((dir) => dir.id !== directoryId));
    });
  };

  const handleDeleteFile = (fileId) => {
    deleteFile(fileId).then(() => {
      alert('File deleted successfully!');
      setFiles(files.filter((file) => file.id !== fileId));
    });
  };

  const handleRenameDirectory = () => {
    if (!renameDirectoryId || !renameDirectoryName.trim()) {
      alert('Please select a directory and provide a new name.');
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

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header text-center">
          <h1>{currentDirectory ? `Directory: ${currentDirectory.name}` : 'Root Directory'}</h1>
        </div>
        <div className="card-body">
          {currentDirectory && (
            <button
              className="btn btn-secondary mb-3"
              onClick={() => setCurrentDirectory(currentDirectory.parent || null)}
            >
              Go to Parent Directory
            </button>
          )}
          {!currentDirectory && <p className="text-center">You are in the Root Directory</p>}

          {/* Directories Section */}
          <div className="card w-50">
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
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDeleteDirectory(dir.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => setRenameDirectoryId(dir.id)}
                      >
                        Rename
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
            </div>
          </div>

          {renameDirectoryId && (
            <div className="card mb-3">
              <div className="card-header text-center">
                <h3>Rename Directory</h3>
              </div>
              <div className="card-body">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New Directory Name"
                    value={renameDirectoryName}
                    onChange={(e) => setRenameDirectoryName(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleRenameDirectory}>
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
            </div>
          )}
        </div>

        {/* Files Section */}
        <div className="card mb-3">
          <div className="card-header text-center">
            <h2>Files</h2>
          </div>
          <div className="card-body">
            <ul className="list-group mb-3">
              {files.map((file) => (
                <li key={file.id} className="list-group-item">
                  <p>
                    <strong>File Name:</strong> {file.name}
                  </p>
                  <p>
                    <strong>Download:</strong>{' '}
                    <a href={file.file} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                  </p>
                  <FileDetailsDialog file={file} />
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <FileUploadForm directoryId={currentDirectory?.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
