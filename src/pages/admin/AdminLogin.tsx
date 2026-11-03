import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authApi } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter username and password.');
      return;
    }
    setLoading(true);
    try {
      await authApi.login(username, password);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-saffron to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">UPSC Saarthi Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Secure administrator access</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 mb-6">
            <AlertCircle size={16} className="shrink-0" />
            <span>This is a restricted area. Unauthorized access is prohibited.</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input-field"
                placeholder="Admin username"
                autoComplete="username"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Admin password"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              <Lock size={16} />
              {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-400">
            Default credentials are set in your .env file. Change them immediately after first login.
          </div>
        </div>
      </div>
    </div>
  );
}
