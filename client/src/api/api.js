// src/api/api.js

const API_BASE = 'http://localhost:3003/api/paste';

export const createPaste = async (text, file) => {
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (text) formData.append('content', text);
  formData.append('contentType', 'text/plain');

  const response = await fetch(API_BASE, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error || 'Request failed');
    error.response = { data };
    throw error;
  }

  return data;
};

export const fetchPaste = async (pasteId) => {
  const response = await fetch(`${API_BASE}/${pasteId}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error || 'Request failed');
    error.response = { data };
    throw error;
  }
  return data;
};
