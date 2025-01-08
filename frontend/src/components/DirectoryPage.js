
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
    if (!renameDirectoryId || !renameDirectoryName) {
      alert('Please select a directory and provide a new name.');
      return;
    }
    renameDirectory(renameDirectoryId, { name: renameDirectoryName })
      .then(() => {
        alert('Directory renamed successfully!');
        setDirectories(
          directories.map((dir) =>
            dir.id === renameDirectoryId ? { ...dir, name: renameDirectoryName } : dir
          )
        );
        setRenameDirectoryId(null);
        setRenameDirectoryName('');
      })
      .catch((error) => {
        console.error('Failed to rename directory:', error.response || error);
        alert('Failed to rename the directory. Please try again.');
      });
  };
  

  return (
    <div>
      <h1>{currentDirectory ? `Directory: ${currentDirectory.name}` : 'Root Directory'}</h1>

      {currentDirectory ? (
        < button onClick={() => setCurrentDirectory(currentDirectory.parent || null)} >
          Go to Parent Directory
        </button>
        
        ) : (
          <p>You are in the Root Directory</p>
      )}


      <h2>Directories</h2>
      <ul>
        {directories.map((dir) => (
          <li key={dir.id}>
            <button onClick={() => setCurrentDirectory(dir)}>{dir.name}</button>
            <button onClick={() => handleDeleteDirectory(dir.id)}>Delete</button>
            <button onClick={() => setRenameDirectoryId(dir.id)}>Rename</button>
          </li>
        ))}
      </ul>

      {renameDirectoryId && (
        <div>
          <h3>Rename Directory</h3>
          <input
            type="text"
            placeholder="New Directory Name"
            value={renameDirectoryName}
            onChange={(e) => setRenameDirectoryName(e.target.value)}
          />
          <button onClick={handleRenameDirectory}>Save</button>
          <button
            onClick={() => {
              setRenameDirectoryId(null);
              setRenameDirectoryName('');
            }}
          >
            Cancel
          </button>
        </div>
      )}

<h2>Files</h2>
<ul>
  {files.map((file) => (
    <li key={file.id}>
      {/* Display file details */}
      <p><strong>File Name:</strong> {file.name}</p>
      <p>
        <strong>Download:</strong>{' '}
        <a href={file.file} target="_blank" rel="noopener noreferrer">
          {file.name}
        </a>
      </p>
      <FileDetailsDialog file={file} />
      <button onClick={() => handleDeleteFile(file.id)}>Delete</button>
    </li>
  ))}
</ul>


      <h3>Create New Directory</h3>
      <input
        type="text"
        placeholder="New Directory Name"
        value={newDirectoryName}
        onChange={(e) => setNewDirectoryName(e.target.value)}
      />
      <button onClick={handleCreateDirectory}>Create Directory</button>

      <FileUploadForm directoryId={currentDirectory?.id} />
    </div>
  );
};

export default DirectoryPage;


