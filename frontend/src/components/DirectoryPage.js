import React, { useState, useEffect } from 'react';
import {
  fetchDirectories,
  fetchSubDirectories,
  fetchFiles,
  createDirectory,
  deleteDirectory,
  deleteFile,
} from '../api';
import FileUploadForm from './FileUploadForm';

const DirectoryPage = () => {
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState(null);
  const [newDirectoryName, setNewDirectoryName] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false); // Define state for showing/hiding upload form

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
      fetchDirectories().then((res) => setDirectories(res.data));
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
                          className="btn btn-danger btn-sm me-2"
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
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="card-body">
            <div className="card w-40 mx-auto">
              <div className="card-header text-center">
                <h2>Files</h2>
              </div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Directory</th>
                    <th>Download</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.id}>
                      <td>{file.name}</td>
                      <td>{file.directory_name || 'Unknown'}</td>
                      <td>
                        <a
                          href={file.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          Download
                        </a>
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFile(file.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* File Upload Form */}
          <div className="text-center mt-4">
            <button
              className="btn btn-success"
              onClick={() => setShowUploadForm(true)}
            >
              Upload File
            </button>
          </div>
          {showUploadForm && <FileUploadForm directoryId={currentDirectory?.id} />}
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
