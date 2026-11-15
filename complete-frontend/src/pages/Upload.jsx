import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMusic } from '../api.js';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!file || !title) {
      setError('Please select a file and enter a title.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('music', file);
      await createMusic(formData);
      setSuccess('Music uploaded successfully!');
      setTitle('');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0b0b12]">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="text-muted-text hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">Upload Music</h1>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-secondary/10 border-secondary/30 text-primary px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        <div className="bg-[#1a1a2e] rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-text mb-2">Track title</label>
              <input
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter track title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-text mb-2">Music file</label>
              <div className="flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed border-gray-700 rounded-xl bg-card/50 hover:border-primary/50 transition-colors cursor-pointer group">
                <svg className="w-8 h-8 text-muted-text group-hover:text-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-sm text-muted-text">Click to upload or drag and drop</p>
                <input
                  type="file"
                  accept="audio/*"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
            </div>
            <button
              className="spotify-btn w-full py-3"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Track'}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-muted-text">
          Supported formats: MP3, WAV, OGG
        </p>
      </div>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <button onClick={() => navigate('/')} className="nav-link">← Back to Home</button>
      </div>
    </div>
  );
}


