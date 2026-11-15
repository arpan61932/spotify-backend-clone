import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAlbums, getAlbumById } from '../api.js';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    try {
      const res = await getAllAlbums();
      setAlbums(res.data.albums);
    } catch (e) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-text text-sm">Loading albums...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0b0b12]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Albums</h1>
          <p className="text-muted-text mt-1">Discover new albums</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="nav-link text-sm"
        >
          ← Back to Home
        </button>
      </div>

      {albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold text-white">No albums yet</h3>
          <p className="text-muted-text mt-2">Be the first to create an album.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {albums.map((a) => (
            <div
              key={a._id}
              className="card group"
              onClick={() => navigate(`/albums/${a._id}`)}
            >
              <div className="aspect-square rounded-xl bg-[#1a1a2e] overflow-hidden relative mb-4 group-hover:scale-105 transition-transform duration-200">
                <div className="absolute inset-0 flex items-center justify-center bg-[#0b0b12]/40">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-white line-clamp-2">{a.title}</h3>
              <p className="text-sm text-muted-text">{a.artist?.username || 'Unknown Artist'}</p>
              <p className="text-xs text-muted-text mt-1">{a.musics?.length || 0} tracks</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


