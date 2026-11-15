import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getAllMusics, getAllAlbums, createMusic, createAlbum, logoutUser } from '../api.js';

export default function Home() {
  const { user } = useAuth();
  const [tab, setTab] = useState('songs');
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumMusics, setAlbumMusics] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [mRes, aRes] = await Promise.all([getAllMusics(), getAllAlbums()]);
      setMusics(mRes.data.musics);
      setAlbums(aRes.data.albums);
    } catch (e) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem('mm_user');
    navigate('/login');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!file || !title) {
      setError('Please enter title and select a file.');
      return;
    }
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('music', file);
      await createMusic(formData);
      setSuccess('Song uploaded!');
      setTitle('');
      setFile(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!albumTitle || !albumMusics) {
      setError('Enter album title and music IDs.');
      return;
    }
    try {
      const ids = albumMusics.split(',').map(s => s.trim()).filter(Boolean);
      await createAlbum({ title: albumTitle, musics: ids });
      setSuccess('Album created!');
      setAlbumTitle('');
      setAlbumMusics('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Album creation failed');
    }
  };

  if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 bg-[#0b0b12]">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Vybe</h1>
          <p className="text-sm text-muted-text">
            Logged in as <span className="text-white font-medium">{user?.username || 'User'}</span>
            <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${user?.role === 'artist' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-700 text-muted-text'}`}>
              {user?.role === 'artist' ? 'ARTIST' : 'LISTENER'}
            </span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs text-red-400 hover:bg-red-400/10 rounded-lg transition"
        >
          Log out
        </button>
      </header>

      <div className="flex gap-2 mb-6 border-b border-gray-800 pb-2">
        <button
          onClick={() => setTab('songs')}
          className={`px-4 py-2 text-sm rounded-lg transition ${tab === 'songs' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-text hover:text-white'}`}
        >
          Songs
        </button>
        <button
          onClick={() => setTab('albums')}
          className={`px-4 py-2 text-sm rounded-lg transition ${tab === 'albums' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-text hover:text-white'}`}
        >
          Albums
        </button>
      </div>

      {tab === 'songs' && (
        <div className="space-y-8">
          {user?.role === 'artist' && (
            <section className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">Upload Song</h2>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded mb-4 text-sm">{error}</div>
              )}
              {success && (
                <div className="bg-secondary/10 border-secondary/30 text-primary px-3 py-2 rounded mb-4 text-sm">{success}</div>
              )}
              <form onSubmit={handleUpload} className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-text mb-1">Song title</label>
                  <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter song title" required />
                </div>
                <div>
                  <label className="block text-xs text-muted-text mb-1">Audio file</label>
                  <input type="file" accept="audio/*" className="input-field text-sm" onChange={(e) => setFile(e.target.files[0])} required />
                </div>
                <button className="spotify-btn w-full py-2.5" type="submit" disabled={uploadLoading}>
                  {uploadLoading ? 'Uploading...' : 'Upload Song'}
                </button>
              </form>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold text-white mb-4">All Songs</h2>
            {musics.length === 0 ? (
              <p className="text-muted-text text-sm">No songs available.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {musics.map((m) => (
                  <div key={m._id} className="card">
                    <div className="aspect-square rounded-lg bg-[#1a1a2e] overflow-hidden mb-3 relative">
                      <audio controls className="w-full h-full" src={m.uri}></audio>
                    </div>
                    <h3 className="font-medium text-white line-clamp-1">{m.title}</h3>
                    <p className="text-xs text-muted-text">{m.artist?.username || 'Unknown'}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {tab === 'albums' && (
        <div className="space-y-8">
          {user?.role === 'artist' && (
            <section className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">Create Album</h2>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded mb-4 text-sm">{error}</div>
              )}
              {success && (
                <div className="bg-secondary/10 border-secondary/30 text-primary px-3 py-2 rounded mb-4 text-sm">{success}</div>
              )}
              <form onSubmit={handleCreateAlbum} className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-text mb-1">Album title</label>
                  <input className="input-field" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} placeholder="Enter album title" required />
                </div>
                <div>
                  <label className="block text-xs text-muted-text mb-1">Music IDs (comma separated)</label>
                  <input className="input-field" value={albumMusics} onChange={(e) => setAlbumMusics(e.target.value)} placeholder="e.g. id1, id2" required />
                </div>
                <button className="spotify-btn w-full py-2.5" type="submit">Create Album</button>
              </form>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold text-white mb-4">All Albums</h2>
            {albums.length === 0 ? (
              <p className="text-muted-text text-sm">No albums available.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {albums.map((a) => (
                  <div key={a._id} className="card">
                    <div className="aspect-square rounded-lg bg-[#1a1a2e] mb-3 flex items-center justify-center text-muted-text text-sm">
                      💿
                    </div>
                    <h3 className="font-medium text-white line-clamp-1">{a.title}</h3>
                    <p className="text-xs text-muted-text">{a.artist?.username || 'Unknown'} • {a.musics?.length || 0} songs</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}



