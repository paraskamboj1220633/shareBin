// src/api/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:3003/api/paste';

export const createPaste = async (text, file) => {
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (text) formData.append('content', text);
  formData.append('contentType', 'text/plain');

  const { data } = await axios.post(API_BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const fetchPaste = async (pasteId) => {
  const { data } = await axios.get(`${API_BASE}/${pasteId}`);
  return data;
};
