import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import PrivateAuth from './PrivateAuth';
import { diaryApi, privateAuthApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface DiaryEntry {
  id: string;
  title: string;
  date: string;
  content: string;
  mood: string;
}

const moodEmoji: Record<string, string> = {
  happy: '😊', sad: '😢', excited: '🎉', calm: '😌', grateful: '🙏', loving: '💕', nostalgic: '🌅',
};

export default function DiaryEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    privateAuthApi.status('diary').then(res => {
      if (res.data.authenticated) setAuthenticated(true);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!authenticated || !id) return;
    setLoading(true);
    diaryApi.getOne(id).then(res => setEntry(res.data)).catch(() => {
      toast.error('Entry not found.');
      navigate('/notes/diary');
    }).finally(() => setLoading(false));
  }, [authenticated, id, navigate]);

  if (!authenticated) {
    return (
      <PrivateAuth
        sectionId="diary"
        sectionName="Personal Diary"
        gradientClass="from-teal-500 to-emerald-600"
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-4">
        <div className="skeleton h-8 w-2/3"></div>
        <div className="skeleton h-4 w-40"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="animate-fade-in min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/notes/diary" className="flex items-center gap-2 text-teal-600 hover:text-teal-800 text-sm font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Diary
        </Link>
        <article className="bg-white rounded-2xl shadow-card p-8 md:p-12">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{moodEmoji[entry.mood] || '📔'}</span>
              {entry.mood && <span className="tag bg-teal-50 text-teal-700 capitalize">{entry.mood}</span>}
            </div>
            <h1 className="text-3xl font-bold text-navy font-serif mb-3">{entry.title}</h1>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar size={14} />
              <span>{entry.date}</span>
            </div>
          </div>
          <div className="prose-content whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">{entry.content}</div>
          <div className="mt-10 pt-6 border-t border-gray-100 text-gray-400 text-sm italic text-right">
            <BookOpen size={14} className="inline mr-1.5" />
            Personal diary entry
          </div>
        </article>
      </div>
    </div>
  );
}
