import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser({ username: form.usernameOrEmail, email: form.usernameOrEmail, password: form.password });
      setUser(res.data.user);
      localStorage.setItem('mm_user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b12] p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-4 font-black text-2xl text-black">M</div>
          <h1 className="text-3xl font-black tracking-tighter text-white italic">Vybe</h1>
          <p className="text-muted-text text-sm mt-1">Welcome back</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-text mb-1 uppercase tracking-wider">Username or Email</label>
            <input
              className="input-field"
              value={form.usernameOrEmail}
              onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
              placeholder="username or email"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-text mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="spotify-btn w-full py-3" type="submit">
            Log in
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">Create account</Link>
        </p>
      </div>
    </div>
  );
}


