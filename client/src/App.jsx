import React, { useState, useEffect } from 'react';
import './App.css';

// const API_URL = 'http://localhost:5000/api/paste';
const API_URL = 'https://pastebin-jqam.onrender.com/api/paste';

export default function App() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [pasteId, setPasteId] = useState('');
  const [pasteToView, setPasteToView] = useState('');
  const [result, setResult] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = async () => {
    if (!text && !file) return alert('Please enter text or upload a file.');

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text) formData.append('content', text);
    formData.append('contentType', 'text/plain');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.pasteId) setPasteId(data.pasteId);
      else alert('Failed to create paste.');
    } catch {
      alert('Network error. Try again.');
    }
  };

  const handleViewPaste = async () => {
    if (!pasteToView) return alert('Enter paste ID to view.');
    try {
      const res = await fetch(`${API_URL}/${pasteToView.trim()}`);
      const data = await res.json();
      if (data.error) alert(data.error);
      else setResult(data);
    } catch {
      alert('Network error. Try again.');
    }
  };

  const resetForm = () => {
    setText('');
    setFile(null);
    setPasteId('');
    setPasteToView('');
    setResult(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">📦 Pastebin</h1>
        <label className="theme-switch">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <span className="slider" />
        </label>
      </header>

      <main className="main">
        <section className="card create-card">
          <h2>Create a Paste</h2>
          <textarea
            placeholder="Write or paste your text/code here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <label className="file-input-label">
            Upload File
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="*"
            />
          </label>
          <button className="btn" onClick={handleSubmit}>
            Create Paste
          </button>

          {pasteId && (
            <div className="paste-link">
              <p>✅ Paste created!</p>
              <input
                type="text"
                readOnly
                value={`${API_URL}/${pasteId}`}
                onClick={(e) => e.target.select()}
              />
            </div>
          )}
        </section>

        <section className="card view-card">
          <h2>View a Paste</h2>
          <input
            type="text"
            placeholder="Enter paste ID"
            value={pasteToView}
            onChange={(e) => setPasteToView(e.target.value)}
          />
          <button className="btn" onClick={handleViewPaste}>
            View Paste
          </button>

          {result && (
            <article className="paste-result">
              {result.content && (
                <>
                  <h3>📝 Text Content</h3>
                  <pre>{result.content}</pre>
                </>
              )}

              {result.fileUrl && (
                <>
                  <h3>📎 Attached File</h3>
                  <a
                    href={result.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-download"
                  >
                    Download File
                  </a>

                  {result.contentType.startsWith('image/') && (
                    <img
                      src={result.fileUrl}
                      alt="uploaded"
                      className="media"
                    />
                  )}
                  {result.contentType.startsWith('video/') && (
                    <video controls className="media">
                      <source src={result.fileUrl} type={result.contentType} />
                    </video>
                  )}
                  {result.contentType.startsWith('audio/') && (
                    <audio controls className="media">
                      <source src={result.fileUrl} type={result.contentType} />
                    </audio>
                  )}
                </>
              )}
            </article>
          )}
        </section>
      </main>

      <footer>
        <button className="btn reset-btn" onClick={resetForm}>
          🔄 Reset
        </button>
      </footer>
    </div>
  );
}
