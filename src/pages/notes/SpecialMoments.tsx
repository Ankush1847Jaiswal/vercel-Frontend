import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Lock } from 'lucide-react';
import PrivateAuth from './PrivateAuth';
import { momentsApi, privateAuthApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface DocumentRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  caption: string;
  type: string;
  hasPhoto: boolean;
}

export default function SpecialMoments() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-lock when leaving this section
  useEffect(() => {
    return () => {
      privateAuthApi.lock('moments').catch(() => {});
    };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon?.('/api/private-auth/lock/moments');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const handleLockAndExit = async () => {
    await privateAuthApi.lock('moments').catch(() => {});
    navigate('/notes');
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await momentsApi.getAll();
      setDocuments(res.data);
    } catch {
      toast.error('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  if (!authenticated) {
    return (
      <PrivateAuth
        sectionId="moments"
        sectionName="Documents"
        gradientClass="from-amber-500 to-orange-500"
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-4">
            <Link
              to="/notes"
              className="inline-flex items-center gap-1.5 text-amber-100 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Back to Notes
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={28} className="text-amber-200" />
              <div>
                <h1 className="text-2xl font-bold">Documents</h1>
                <p className="text-amber-200 text-sm">{documents.length} records archived</p>
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
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Timeline */}
        {loading ? (
          <div className="space-y-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex gap-6">
                <div className="skeleton w-12 h-12 rounded-full"></div>
                <div className="card flex-1 p-5 space-y-2">
                  <div className="skeleton h-5 w-40"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FileText size={56} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No documents archived yet</p>
            <p className="text-sm mt-2">Add records and documents through the admin panel.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-orange-300 opacity-40"></div>
            <div className="space-y-8">
              {documents.map((doc) => (
                <div key={doc.id} className="flex gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-lg shadow-lg z-10 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="card p-5 flex-1 hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-start gap-3">
                      {doc.hasPhoto && (
                        <img
                          src={momentsApi.getPhotoUrl(doc.id)}
                          alt={doc.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-amber-600 font-semibold">{doc.date}</span>
                        </div>
                        <h3 className="font-bold text-navy text-lg mb-1">{doc.title}</h3>
                        {doc.caption && <p className="text-amber-600 text-sm mb-2">{doc.caption}</p>}
                        {doc.description && <p className="text-gray-500 text-sm leading-relaxed">{doc.description}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
