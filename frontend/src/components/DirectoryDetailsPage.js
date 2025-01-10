import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSubDirectories, fetchFiles } from '../api';

const DirectoryDetailsPage = () => {
  const { id } = useParams(); // Get the directory ID from the URL
  const [subDirectories, setSubDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch subdirectories and files for the selected directory
    const fetchData = async () => {
      try {
        const subDirsRes = await fetchSubDirectories(id);
        const filesRes = await fetchFiles(id);
        setSubDirectories(subDirsRes.data);
        setFiles(filesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching directory details:', err);
        setError('Failed to fetch directory details. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <p>Loading directory details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4 text-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Directory Details</h1>
      <h2>Subdirectories</h2>
      {subDirectories.length === 0 ? (
        <p className="text-muted">No subdirectories found.</p>
      ) : (
        <ul className="list-group">
          {subDirectories.map((dir) => (
            <li key={dir.id} className="list-group-item">
              {dir.name}
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-4">Files</h2>
      {files.length === 0 ? (
        <p className="text-muted">No files found in this directory.</p>
      ) : (
        <ul className="list-group">
          {files.map((file) => (
            <li
              key={file.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{file.name}</span>
              <a
                href={file.file}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DirectoryDetailsPage;
