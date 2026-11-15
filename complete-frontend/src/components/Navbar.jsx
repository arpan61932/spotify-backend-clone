import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('mm_user');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0b0b12] border-b border-gray-800 z-50">
      <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap- font-black text-4xl tracking-tighter text-white italic">
          <span className="text-primary">V</span>ybe
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-xs text-muted-text uppercase tracking-widest">
                {user.role === 'artist' ? 'Artist' : 'Listener'}
              </span>
              <button onClick={logout} className="text-xs text-red-400 hover:text-red-300">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-gray-300 hover:text-white rounded bg-gray-800">Log in</Link>
              <Link to="/register" className="px-3 py-2 text-black bg-primary rounded hover:bg-secondary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


