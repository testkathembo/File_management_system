import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Adjust as necessary
});

export const fetchDirectories = () => API.get('/directories/');

export const fetchSubDirectories = (directoryId) =>
  API.get(`/directories/${directoryId}/sub_directories`);

export const fetchFiles = (directoryId) =>
  API.get(directoryId ? `/directories/${directoryId}/files` : `/files/`);


export const createDirectory = (data) => API.post('/directories/', data);

export const deleteDirectory = (directoryId) =>
  API.delete(`/directories/${directoryId}/`);

export const renameDirectory = (directoryId, data) => {
  return API.put(`/directories/${directoryId}/`, data, {
    headers: {
      'Content-Type': 'application/json', // Ensure JSON is set for renaming
    },
  });
};


export const deleteFile = (fileId) => API.delete(`/files/${fileId}/`);

export const uploadFile = (formData) => {
  return API.post('/files/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Ensure multipart is set
    },
  });
};

export const updateFile = (fileId, formData) => {
  return API.put(`/files/${fileId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // For file upload
    },
  });
};




