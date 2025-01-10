import React, { useState, useEffect } from 'react';
import { fetchHighLevelDirectoriesAndFiles } from '../api';

const HighLevelPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHighLevelDirectoriesAndFiles()
      .then((res) => {
        console.log('High-level directories data:', res.data); // Log the data
        setData(res.data.data); // Ensure you're accessing the "data" key from the API response
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching high-level directories:', err);
        setError('Failed to fetch directories. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <p>Loading high-level directories and files...</p>
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
      <h1 className="text-center mb-4">High-Level Directories and Files</h1>
      {data.length === 0 && (
        <p className="text-muted text-center">No high-level directories available.</p>
      )}
      {data.map((directory) => (
        <div key={directory.id} className="card mb-3">
          <div className="card-header">
            <h5>{directory.name}</h5>
          </div>
          <div className="card-body">
            {directory.files.length > 0 ? (
              <ul className="list-group">
                {directory.files.map((file) => (
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
            ) : (
              <p className="text-muted">No files in this directory.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HighLevelPage;
