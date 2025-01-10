import axios from 'axios';

// Axios instance with base URL
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Backend API base URL
});

// Add global error handling with Axios interceptors (optional)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/** Directory Endpoints **/

// Fetch all directories
export const fetchDirectories = () => API.get('/directories/');

// Fetch subdirectories of a specific directory
export const fetchSubDirectories = (directoryId) =>
  API.get(`/directories/${directoryId}/sub_directories`);

// Create a new directory
export const createDirectory = (data) => API.post('/directories/', data);

// Rename an existing directory
export const renameDirectory = (directoryId, data) =>
  API.put(`/directories/${directoryId}/`, data, {
    headers: { 'Content-Type': 'application/json' },
  });

// Delete a directory (only if empty)
export const deleteDirectory = (directoryId) => API.delete(`/directories/${directoryId}/`);


export const fetchHighLevelDirectoriesAndFiles = async () => {
  return await API.get('/directories/high-level/');
};


/** File Endpoints **/

// Fetch files in a specific directory
export const fetchFiles = (directoryId) =>
  API.get(directoryId ? `/directories/${directoryId}/files` : '/files/');

// Upload a file to a specific directory
export const uploadFile = (formData) =>
  API.post('/files/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Update file details (name or directory)
export const updateFile = (fileId, formData) =>
  API.put(`/files/${fileId}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Delete a file
export const deleteFile = (fileId) => API.delete(`/files/${fileId}/`);

export default API;
