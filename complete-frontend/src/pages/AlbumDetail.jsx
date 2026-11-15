import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumById } from '../api.js';

export default function AlbumDetail() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbum();
  }, [albumId]);

  async function fetchAlbum() {
    try {
      const res = await getAlbumById(albumId);
      setAlbum(res.data.album);
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
        <p className="text-muted-text text-sm">Loading album...</p>
      </div>
    </div>
  );
  if (!album) return (
    <div className="min-h-screen pt-16 flex items-center justify-center text-center">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">Album not found</h3>
        <button
          onClick={() => navigate('/albums')}
          className="mt-4 nav-link"
        >
          Back to Albums
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0b0b12]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => navigate('/albums')} className="nav-link text-sm mb-4 inline-block">
            ← Back to Albums
          </button>
          <h1 className="text-4xl font-black text-white">{album.title}</h1>
          <p className="text-muted-text mt-2">
            Artist: <span className="text-white font-medium">{album.artist?.username || 'Unknown'}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {(album.musics || []).map((m, idx) => (
          <div key={m._id} className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {idx + 1}
            </div>
            <audio controls className="flex-1" src={m.uri}></audio>
            <span className="text-white">{m.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


