import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Mail } from 'lucide-react';
import PrivateAuth from './PrivateAuth';
import { lettersApi, privateAuthApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Letter {
  id: string;
  title: string;
  date: string;
  content: string;
  created_at: string;
}

export default function LetterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [letter, setLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    privateAuthApi.status('letters').then(res => {
      if (res.data.authenticated) setAuthenticated(true);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!authenticated || !id) return;
    setLoading(true);
    lettersApi.getOne(id).then(res => setLetter(res.data)).catch(() => {
      toast.error('Letter not found.');
      navigate('/notes/letters');
    }).finally(() => setLoading(false));
  }, [authenticated, id, navigate]);

  // Auto-lock when leaving this section
  useEffect(() => {
    return () => {
      if (!window.location.pathname.startsWith('/notes/letters')) {
        privateAuthApi.lock('letters').catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon?.('/api/private-auth/lock/letters');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  if (!authenticated) {
    return (
      <PrivateAuth
        sectionId="letters"
        sectionName="Messages"
        gradientClass="from-violet-500 to-purple-600"
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="space-y-4">
          <div className="skeleton h-8 w-2/3"></div>
          <div className="skeleton h-5 w-40"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!letter) return null;

  return (
    <div className="animate-fade-in min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/notes/letters" className="flex items-center gap-2 text-violet-600 hover:text-violet-800 text-sm font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Messages
        </Link>

        <article className="bg-white rounded-2xl shadow-card p-8 md:p-12">
          {/* Letter header */}
          <div className="text-center mb-10 pb-8 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <Mail size={22} className="text-violet-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-navy font-serif leading-tight mb-4">
              {letter.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Calendar size={14} />
              <span>{letter.date}</span>
            </div>
          </div>

          {/* Letter content */}
          <div className="prose-content whitespace-pre-wrap text-gray-700 leading-relaxed font-serif text-lg">{letter.content}</div>
        </article>
      </div>
    </div>
  );
}
