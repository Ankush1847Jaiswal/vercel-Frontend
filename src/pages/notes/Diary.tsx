import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Calendar, ArrowLeft, Lock } from 'lucide-react';
import PrivateAuth from './PrivateAuth';
import { diaryApi, privateAuthApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface DiaryEntry {
  id: string;
  title: string;
  date: string;
  content: string;
  mood: string;
  created_at: string;
}

export default function Diary() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');

  // Auto-lock when leaving this section
  useEffect(() => {
    return () => {
      if (!window.location.pathname.startsWith('/notes/diary')) {
        privateAuthApi.lock('diary').catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon?.('/api/private-auth/lock/diary');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const handleLockAndExit = async () => {
    await privateAuthApi.lock('diary').catch(() => {});
    navigate('/notes');
  };

  const fetchEntries = useCallback(async () => {
    try {
      const res = await diaryApi.getAll(search || undefined, sort);
      setEntries(res.data);
    } catch {
      toast.error('Failed to load articles.');
    } finally {
      setLoading(false);
    }
  }, [search, sort]);

  useEffect(() => {
    if (authenticated) fetchEntries();
  }, [authenticated, fetchEntries]);

  if (!authenticated) {
    return (
      <PrivateAuth
        sectionId="diary"
        sectionName="Articles"
        gradientClass="from-teal-500 to-emerald-600"
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-4">
            <Link
              to="/notes"
              className="inline-flex items-center gap-1.5 text-teal-100 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Back to Notes
            </Link>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen size={28} className="text-teal-200" />
              <div>
                <h1 className="text-2xl font-bold">Articles</h1>
                <p className="text-teal-200 text-sm">{entries.length} articles in archive</p>
              </div>
            </div>
            <button
              onClick={handleLockAndExit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 hover:bg-black/30 rounded-lg text-sm text-white transition-colors"
              title="Lock and return to Notes"
            >
              <Lock size={14} /> Lock &amp; Exit
            </button>
          </div>

          {/* Search & Sort */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as 'desc' | 'asc')}
              className="px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm focus:outline-none"
            >
              <option value="desc" className="text-gray-800">Newest First</option>
              <option value="asc" className="text-gray-800">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => <div key={i} className="card p-5 space-y-3"><div className="skeleton h-5 w-1/2"></div><div className="skeleton h-4 w-full"></div><div className="skeleton h-4 w-3/4"></div></div>)}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <BookOpen size={56} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No articles yet</p>
            {search && <p className="text-sm mt-2">No results for "{search}"</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <Link key={entry.id} to={`/notes/diary/${entry.id}`} className="block group">
                <div className="card p-5 hover:shadow-card-hover transition-all duration-300 hover:border-l-4 hover:border-l-teal-500 border border-transparent">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-teal-600 font-semibold flex items-center gap-1">
                          <Calendar size={12} /> {entry.date}
                        </span>
                        {entry.mood && (
                          <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full">{entry.mood}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-navy text-lg group-hover:text-teal-700 transition-colors">{entry.title}</h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2 leading-relaxed">
                        {entry.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-teal-500 shrink-0 mt-1 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
