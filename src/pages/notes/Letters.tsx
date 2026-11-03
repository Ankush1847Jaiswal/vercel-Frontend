import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Calendar } from 'lucide-react';
import PrivateAuth from './PrivateAuth';
import { lettersApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Letter {
  id: string;
  title: string;
  date: string;
  content: string;
  published: boolean;
  created_at: string;
}

export default function Letters() {
  const [authenticated, setAuthenticated] = useState(false);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLetters = useCallback(async () => {
    try {
      const res = await lettersApi.getAll();
      setLetters(res.data);
    } catch {
      toast.error('Failed to load letters.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchLetters();
  }, [authenticated, fetchLetters]);

  if (!authenticated) {
    return (
      <PrivateAuth
        sectionId="letters"
        sectionName="Letters to Her"
        gradientClass="from-violet-500 to-purple-600"
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Mail size={28} className="text-violet-300" />
            <div>
              <h1 className="text-2xl font-bold">Letters to Her</h1>
              <p className="text-violet-200 text-sm">{letters.length} letters written with love</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => <div key={i} className="card p-6 space-y-3"><div className="skeleton h-6 w-2/3"></div><div className="skeleton h-4 w-full"></div><div className="skeleton h-4 w-4/5"></div></div>)}
          </div>
        ) : letters.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Mail size={56} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No letters yet</p>
            <p className="text-sm mt-2">Letters will appear here once they are written and published.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {letters.map((letter, i) => (
              <Link key={letter.id} to={`/notes/letters/${letter.id}`} className="block group">
                <div className="card p-6 hover:shadow-card-hover transition-all duration-300 border border-transparent hover:border-violet-200 group-hover:border-l-4 group-hover:border-l-violet-500">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-violet-400 font-serif text-sm italic">Letter #{i + 1}</span>
                      </div>
                      <h2 className="text-xl font-bold text-navy group-hover:text-violet-700 transition-colors mb-2 font-serif">
                        {letter.title}
                      </h2>
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                        {letter.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                        <Calendar size={12} />
                        {letter.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-violet-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    Read Letter <ArrowRight size={14} />
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
