import React, { useState, useEffect } from 'react';
import {
  fetchDirectories,
  fetchSubDirectories,
  fetchFiles,
  createDirectory,
  deleteDirectory,
  deleteFile,
  renameDirectory,
  updateFile,
} from '../api';
import FileUploadForm from './FileUploadForm';

const DirectoryPage = () => {
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState(null);
  const [newDirectoryName, setNewDirectoryName] = useState('');
  const [renameDirectoryId, setRenameDirectoryId] = useState(null);
  const [renameDirectoryName, setRenameDirectoryName] = useState('');
  const [editingFileId, setEditingFileId] = useState(null);
  const [editingFileName, setEditingFileName] = useState('');
  const [editingFileDirectory, setEditingFileDirectory] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

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

  const handleDeleteFile = (fileId) => {
    deleteFile(fileId).then(() => {
      alert('File deleted successfully!');
      setFiles(files.filter((file) => file.id !== fileId));
    });
  };

  const handleEditFile = (file) => {
    setEditingFileId(file.id);
    setEditingFileName(file.name);
    setEditingFileDirectory(file.directory); // Set the current directory ID
  };

  const handleSaveFileEdit = () => {
    if (!editingFileName.trim()) {
      alert('Please enter a valid file name.');
      return;
    }

    const formData = new FormData();
    formData.append('name', editingFileName);
    formData.append('directory', editingFileDirectory);

    updateFile(editingFileId, formData).then(() => {
      alert('File updated successfully!');
      setFiles(
        files.map((file) =>
          file.id === editingFileId
            ? { ...file, name: editingFileName, directory: editingFileDirectory }
            : file
        )
      );
      setEditingFileId(null);
      setEditingFileName('');
      setEditingFileDirectory('');
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
                      <td>
                        {editingFileId === file.id ? (
                          <input
                            type="text"
                            value={editingFileName}
                            onChange={(e) => setEditingFileName(e.target.value)}
                            className="form-control"
                          />
                        ) : (
                          file.name
                        )}
                      </td>
                      <td>
                        {editingFileId === file.id ? (
                          <select
                            className="form-control"
                            value={editingFileDirectory}
                            onChange={(e) => setEditingFileDirectory(e.target.value)}
                          >
                            <option value="">Select Directory</option>
                            {directories.map((dir) => (
                              <option key={dir.id} value={dir.id}>
                                {dir.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          file.directory_name || 'Unknown'
                        )}
                      </td>
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
                        {editingFileId === file.id ? (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={handleSaveFileEdit}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setEditingFileId(null);
                                setEditingFileName('');
                                setEditingFileDirectory('');
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                             <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
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
